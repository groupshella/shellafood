"use client";

/**
 * Hook for partner registration form logic
 */

import { useState, useCallback, useEffect } from "react";
import { registerPartner, getPartnerZonesList, getPartnerModulesByZone } from "../api/partner.api";
import type { PartnerFormData, Zone, Module, NotificationState } from "../types/partner.types";
import { partnerFormSchema } from "../lib/validation/partner.validation";

export function usePartnerRegistration(initialData: PartnerFormData, language: string) {
	const [formData, setFormData] = useState<PartnerFormData>(initialData);
	const [zones, setZones] = useState<Zone[]>([]);
	const [modules, setModules] = useState<Module[]>([]);
	const [loadingZones, setLoadingZones] = useState(true);
	const [loadingModules, setLoadingModules] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [notification, setNotification] = useState<NotificationState>({
		message: "",
		type: "success",
		isVisible: false,
	});

	const isArabic = language === 'ar';

	const loadZones = useCallback(async () => {
		setLoadingZones(true);
		try {
			const result = await getPartnerZonesList(language);
			if (result.data) {
				setZones(result.data);
			} else {
				setNotification({
					message: result.error || (isArabic ? "فشل تحميل المناطق" : "Failed to load zones"),
					type: "error",
					isVisible: true,
				});
			}
		} catch (error) {
			console.error('Error loading zones:', error);
			setNotification({
				message: isArabic ? "خطأ في تحميل المناطق" : "Error loading zones",
				type: "error",
				isVisible: true,
			});
		} finally {
			setLoadingZones(false);
		}
	}, [language, isArabic]);

	const loadModules = useCallback(async (zoneId: number) => {
		setLoadingModules(true);
		try {
			const result = await getPartnerModulesByZone(zoneId, language);
			if (result.data) {
				setModules(result.data);
			} else {
				setNotification({
					message: result.error || (isArabic ? "فشل تحميل الوحدات" : "Failed to load modules"),
					type: "error",
					isVisible: true,
				});
				setModules([]);
			}
		} catch (error) {
			console.error('Error loading modules:', error);
			setNotification({
				message: isArabic ? "خطأ في تحميل الوحدات" : "Error loading modules",
				type: "error",
				isVisible: true,
			});
			setModules([]);
		} finally {
			setLoadingModules(false);
		}
	}, [language, isArabic]);

	// Load zones on mount
	useEffect(() => {
		loadZones();
	}, [loadZones]);

	// Load modules when zone changes
	useEffect(() => {
		if (formData.zoneId) {
			loadModules(parseInt(formData.zoneId));
		} else {
			setModules([]);
			setFormData((prev) => ({ ...prev, moduleId: "" }));
		}
	}, [formData.zoneId, loadModules]);

	const handleChange = useCallback((
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
	) => {
		const { name, value, type } = e.target;
		const checked = (e.target as HTMLInputElement).checked;
		
		setFormData((prev: PartnerFormData) => ({
			...prev,
			[name]: type === "checkbox" ? checked : value,
		}));
	}, []);
	const handleFileChange = (name: string, file: File | null) => {
		setFormData(prev => ({
			...prev,
			[name]: file
		}));
	};


	const handleSubmit = useCallback(async (e: React.FormEvent) => {
		e.preventDefault();
		
		const result = partnerFormSchema.safeParse(formData);
		if (!result.success) {
			const firstError = result.error.issues[0];
			setNotification({
				message: firstError.message||(isArabic ? "حدث خطأ أثناء التسجيل" : "Registration failed"),
				type: "error",
				isVisible: true,
			});
			return;
		}

		setIsSubmitting(true);
		try {
	
			// Prepare data for API
			const registrationData = {
				f_name: formData.f_name,
				l_name: formData.l_name,
				phone: formData.phone,
				email: formData.email,
				password: formData.password,
				zone_id: parseInt(formData.zoneId),
				module_id: parseInt(formData.moduleId),
				store_name: formData.store_name,
				address: formData.address,
				latitude: formData.latitude,
				longitude: formData.longitude,
				logo: formData.logo,
				cover_photo: formData.cover_photo,
			};
			console.log(registrationData);

			const apiResult = await registerPartner(registrationData, language);
			console.log(apiResult);
			if (apiResult.data) {
				setNotification({
					message: isArabic ? "تم التسجيل بنجاح!" : "Registration successful!",
					type: "success",
					isVisible: true,
				});
				handleReset();
			} else {
				setNotification({
					message: apiResult.error|| (isArabic ? "حدث خطأ أثناء التسجيل" : "Registration failed"),
					type: "error",
					isVisible: true,
				});
			}
		} catch (error) {
			console.error('Error registering partner:', error);
			setNotification({
				message:  (isArabic ? "حدث خطأ أثناء التسجيل" : "Registration failed"),
				type: "error",
				isVisible: true,
			});
		} finally {
			setIsSubmitting(false);
		}
	}, [formData, isArabic, language]);

	const handleReset = useCallback(() => {
		setFormData(initialData);
		setModules([]);
	}, [initialData]);

	return {
		formData,
		setFormData,
		zones,
		modules,
		loadingZones,
		loadingModules,
		isSubmitting,
		notification,
		setNotification,
		handleChange,
		handleFileChange,
		handleSubmit,
		handleReset,
		loadZones,
		loadModules,
	};
}


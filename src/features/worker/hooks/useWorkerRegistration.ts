"use client";

/**
 * Hook for worker registration form logic
 */

import { useState, useCallback, useEffect } from "react";
import { registerWorker, getWorkerZonesList, getWorkerModulesByZone } from "../api/worker.api";
import type { WorkerFormData, Zone, Module, NotificationState } from "../types/worker.types";
import { workerFormSchema } from "../lib/validation/worker.validation";

export function useWorkerRegistration(initialData: WorkerFormData, language: string) {
	const [formData, setFormData] = useState<WorkerFormData>(initialData);
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
			const result = await getWorkerZonesList(language);
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
			const result = await getWorkerModulesByZone(zoneId, language);
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
		if (formData.zone_id) {
			loadModules(parseInt(formData.zone_id));
		} else {
			setModules([]);
			setFormData((prev) => ({ ...prev, module_id: "" }));
		}
	}, [formData.zone_id, loadModules]);

	const handleChange = useCallback((
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
	) => {
		const { name, value, type } = e.target;
		const checked = (e.target as HTMLInputElement).checked;
		
		setFormData((prev: WorkerFormData) => ({
			...prev,
			[name]: type === "checkbox" ? checked : value,
		}));
	}, []);
	const handleFileChange = (name: string, file: File | null) => {
		console.log(file);
		setFormData(prev => ({
			...prev,
			[name]: file
		}));
	};


	const handleSubmit = useCallback(async (e: React.FormEvent) => {
		e.preventDefault();
		
		const result = workerFormSchema.safeParse(formData);
		console.log(result);
		if (!result.success) {
			const firstError = result.error.issues[0];
			setNotification({
				message: firstError.message,
				type: "error",
				isVisible: true,
			});
			return;
		}

		setIsSubmitting(true);
		try {
//data for API
			const registrationData = {
				first_name: formData.first_name,
				last_name: formData.last_name,
				email: formData.email,
				phone_number: formData.phone_number,
				driver_type: formData.driver_type,
				area: formData.area,
				vehicle_type: formData.vehicle_type,
				id_type: formData.id_type,
				id_number: formData.id_number,
				id_image: formData.id_image,
				zone_id: formData.zone_id ? parseInt(formData.zone_id) : undefined,
				module_id: formData.module_id ? parseInt(formData.module_id) : undefined,
			};

			const apiResult = await registerWorker(registrationData, language);
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
					message:(isArabic ? "حدث خطأ أثناء التسجيل" : "Registration failed"),
					type: "error",
					isVisible: true,
				});
			}
		} catch (error) {
			console.error('Error registering worker:', error);
			setNotification({
				message: (isArabic ? "حدث خطأ أثناء التسجيل" : "Registration failed"),
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


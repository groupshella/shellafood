"use client";

/**
 * Hook for driver registration form logic
 */

import { useState, useCallback } from "react";
import { registerDriver, getDriverZonesList } from "../api/driver.api";
import type { DriverFormData, Zone, NotificationState } from "../types/driver.types";
import { driverFormSchema } from "../lib/validation/driver.validation";
import { normalizePhoneNumber } from "../lib/utils/phone.utils";

export function useDriverRegistration(initialData: DriverFormData, language: string) {
	const [formData, setFormData] = useState<DriverFormData>(initialData);
	const [zones, setZones] = useState<Zone[]>([]);
	const [loadingZones, setLoadingZones] = useState(true);
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
			const result = await getDriverZonesList(language);
			if (result.data) {
				setZones(result.data);
			} else {
				setNotification({
					message:  (isArabic ? "فشل تحميل المناطق" : "Failed to load zones"),
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

	const handleChange = useCallback((
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
	) => {
		const { name, value, type } = e.target;
		const checked = (e.target as HTMLInputElement).checked;
		
		setFormData((prev: DriverFormData) => ({
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
		handleReset();
		const result = driverFormSchema.safeParse(formData);
		console.log(result);
		if (!result.success) {
			const firstError = result.error.issues[0];
			setNotification({
				message:firstError.message|| (isArabic ? "حدث خطأ أثناء التسجيل" : "Registration failed"),
				type: "error",
				isVisible: true,
			});
			return;
		}

		setIsSubmitting(true);
		try {
		

			// Normalize phone number
			const normalizedPhone = normalizePhoneNumber(formData.phone, isArabic);
			if (!normalizedPhone) {
				setNotification({
					message: isArabic ? "صيغة رقم الهاتف غير صالحة. يجب أن يكون 9 أرقام" : "Invalid phone format. Must be 9 digits",
					type: "error",
					isVisible: true,
				});
				setIsSubmitting(false);
				return;
			}

			// Prepare data for API
			const registrationData = {
				f_name: formData.f_name,
				l_name: formData.l_name,
				email: formData.email,
				phone: normalizedPhone,
				identity_number: formData.identity_number,
				identity_type: formData.identity_type,
				zone_id: parseInt(formData.zone_id),
				password: formData.password,
				identity_image: formData.identity_image,
				driving_license_image: formData.driving_license_image,
				driver_license_image: formData.driver_license_image,
			};

			const result = await registerDriver(registrationData, language);
			
			if (result.data) {
				setNotification({
					message: isArabic ? "تم التسجيل بنجاح!" : "Registration successful!",
					type: "success",
					isVisible: true,
				});
				handleReset();
			} else {
				setNotification({
					message:result.error||  (isArabic ? "حدث خطأ أثناء التسجيل" : "Registration failed"),
					type: "error",
					isVisible: true,
				});
			}
		} catch (error) {
			console.error('Error registering driver:', error);
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
	}, [initialData]);

	return {
		formData,
		setFormData,
		zones,
		loadingZones,
		isSubmitting,
		notification,
		setNotification,
		handleChange,
		handleSubmit,
		handleReset,
		handleFileChange,
		loadZones,
	};
}


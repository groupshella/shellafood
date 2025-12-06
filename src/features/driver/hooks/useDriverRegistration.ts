"use client";

/**
 * Hook for driver registration form logic
 */

import { useState, useCallback } from "react";
import { registerDriver, getDriverZonesList } from "../api/driver.api";
import type { DriverFormData, Zone, NotificationState } from "../types/driver.types";
import { driverFormSchema } from "../lib/validation/driver.validation";
import { normalizePhoneNumber } from "../lib/utils/phone.utils";
import { urlToFile } from "../lib/utils/file.utils";

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

	const handleUploadComplete = useCallback((
		field: "identity_image" | "driving_license_image" | "driver_license_image",
		successMessage: string,
	) => {
		return (url: string) => {
			setFormData((prev: DriverFormData) => ({ ...prev, [field]: url }));
			if (url) {
				setNotification({
					message: successMessage,
					type: "success",
					isVisible: true,
				});
			}
		};
	}, []);

	const handleUploadError = useCallback((error: Error) => {
		setNotification({
			message: error.message,
			type: "error",
			isVisible: true,
		});
	}, []);

	const handleSubmit = useCallback(async (e: React.FormEvent) => {
		e.preventDefault();
		
		const result = driverFormSchema.safeParse(formData);
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
			// Convert image URLs to Files if they exist
			const identityImageFile = formData.identity_image 
				? await urlToFile(formData.identity_image, "identity_image.jpg") 
				: undefined;
			const drivingLicenseFile = formData.driving_license_image 
				? await urlToFile(formData.driving_license_image, "driving_license.jpg") 
				: undefined;
			const driverLicenseFile = formData.driver_license_image 
				? await urlToFile(formData.driver_license_image, "driver_license.jpg") 
				: undefined;

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
				identity_image: identityImageFile,
				driving_license_image: drivingLicenseFile,
				driver_license_image: driverLicenseFile,
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
					message: result.error || (isArabic ? "حدث خطأ أثناء التسجيل" : "Registration failed"),
					type: "error",
					isVisible: true,
				});
			}
		} catch (error) {
			console.error('Error registering driver:', error);
			setNotification({
				message: error instanceof Error ? error.message : (isArabic ? "حدث خطأ أثناء التسجيل" : "Registration failed"),
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
		handleUploadComplete,
		handleUploadError,
		handleSubmit,
		handleReset,
		loadZones,
	};
}


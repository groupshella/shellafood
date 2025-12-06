"use client";

/**
 * Hook for worker registration form logic
 */

import { useState, useCallback, useEffect } from "react";
import { registerWorker, getWorkerZonesList, getWorkerModulesByZone } from "../api/worker.api";
import type { WorkerFormData, Zone, Module, NotificationState } from "../types/worker.types";
import { workerFormSchema } from "../lib/validation/worker.validation";
import { urlToFile } from "../lib/utils/file.utils";

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

	const handleUploadComplete = useCallback((
		field: "id_image",
		successMessage: string,
	) => {
		return (url: string) => {
			setFormData((prev: WorkerFormData) => ({ ...prev, [field]: url }));
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
		
		const result = workerFormSchema.safeParse(formData);
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
			// Convert image URL to File if it exists
			const idImageFile = formData.id_image 
				? await urlToFile(formData.id_image, "id_image.jpg") 
				: undefined;

			// Prepare data for API
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
				id_image: idImageFile,
				zone_id: formData.zone_id ? parseInt(formData.zone_id) : undefined,
				module_id: formData.module_id ? parseInt(formData.module_id) : undefined,
			};

			const apiResult = await registerWorker(registrationData, language);
			
			if (apiResult.data) {
				setNotification({
					message: isArabic ? "تم التسجيل بنجاح!" : "Registration successful!",
					type: "success",
					isVisible: true,
				});
				handleReset();
			} else {
				setNotification({
					message: apiResult.error || (isArabic ? "حدث خطأ أثناء التسجيل" : "Registration failed"),
					type: "error",
					isVisible: true,
				});
			}
		} catch (error) {
			console.error('Error registering worker:', error);
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
		handleUploadComplete,
		handleUploadError,
		handleSubmit,
		handleReset,
		loadZones,
		loadModules,
	};
}


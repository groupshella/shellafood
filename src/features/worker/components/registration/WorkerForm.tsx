"use client";

import { useLanguage } from "@/providers";
import React, { useEffect } from "react";	
import { NotificationDialog, FormInput, FormSelect, SectionHeader, UploadFileInput, PhoneInput } from "@/shared/components";
import { useWorkerRegistration } from "../../hooks/useWorkerRegistration";
import type { WorkerFormData } from "../../types/worker.types";
import { getDriverTypeOptions, getVehicleTypeOptions, getIdTypeOptions } from "../../constants/worker.constants";

const INITIAL_FORM_DATA: WorkerFormData = {
	first_name: "",
	last_name: "",
	email: "",
	phone_number: "",
	driver_type: "",
	area: "",
	vehicle_type: "",
	id_type: "",
	id_number: "",
	id_image: "",
	zone_id: "",
	module_id: "",
};

export default function WorkerForm() {
	const { t, language } = useLanguage();
	const isArabic = language === 'ar';

	const {
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
	} = useWorkerRegistration(INITIAL_FORM_DATA, language);

	return (
		<form onSubmit={handleSubmit} className="w-full">
			{/* Personal Information Section */}
			<SectionHeader title={isArabic ? "المعلومات الشخصية" : "Personal Information"} isArabic={isArabic} />
			<div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2 mb-8">
				<FormInput
					label={isArabic ? "الاسم الأول" : "First Name"}
					name="first_name"
					type="text"
					placeholder={isArabic ? "أدخل الاسم الأول" : "Enter first name"}
					value={formData.first_name}
					onChange={handleChange}
					required
					isArabic={isArabic}
					disabled={isSubmitting}
				/>

				<FormInput
					label={isArabic ? "اسم العائلة" : "Last Name"}
					name="last_name"
					type="text"
					placeholder={isArabic ? "أدخل اسم العائلة" : "Enter last name"}
					value={formData.last_name}
					onChange={handleChange}
					required
					isArabic={isArabic}
					disabled={isSubmitting}
				/>

				<FormInput
					label={isArabic ? "البريد الإلكتروني" : "Email Address"}
					name="email"
					type="email"
					placeholder={isArabic ? "example@email.com" : "example@email.com"}
					value={formData.email}
					onChange={handleChange}
					required
					isArabic={isArabic}
					disabled={isSubmitting}
				/>

				<PhoneInput
					label={isArabic ? "رقم الهاتف" : "Phone Number"}
					value={formData.phone_number}
					onChange={(phone) => setFormData({ ...formData, phone_number: phone })}
					isArabic={isArabic}
					required
					name="phone_number"
					disabled={isSubmitting}
				/>

				<FormInput
					label={isArabic ? "المنطقة" : "Area"}
					name="area"
					type="text"
					placeholder={isArabic ? "الرياض" : "Riyadh"}
					value={formData.area}
					onChange={handleChange}
					required
					isArabic={isArabic}
					disabled={isSubmitting}
				/>
			</div>

			{/* Work Information Section */}
			<SectionHeader title={isArabic ? "معلومات العمل" : "Work Information"} isArabic={isArabic} />
			<div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2 mb-8">
				<FormSelect
					label={isArabic ? "نوع العمل" : "Work Type"}
					name="driver_type"
					options={getDriverTypeOptions(isArabic)}
					value={formData.driver_type}
					onChange={handleChange}
					required
					isArabic={isArabic}
					disabled={isSubmitting}
					placeholder={isArabic ? "اختر نوع العمل" : "Select work type"}
					helperText={isArabic ? "اختر نوع العمل الذي تريد القيام به" : "Select the type of work you want to do"}
				/>

				<FormSelect
					label={isArabic ? "نوع المركبة" : "Vehicle Type"}
					name="vehicle_type"
					options={getVehicleTypeOptions(isArabic)}
					value={formData.vehicle_type}
					onChange={handleChange}
					required
					isArabic={isArabic}
					disabled={isSubmitting}
					placeholder={isArabic ? "اختر نوع المركبة" : "Select vehicle type"}
					helperText={isArabic ? "اختر نوع المركبة التي ستستخدمها" : "Select the type of vehicle you will use"}
				/>
			</div>

			{/* ID Information Section */}
			<SectionHeader title={isArabic ? "معلومات الهوية" : "ID Information"} isArabic={isArabic} />
			<div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2 mb-8">
				<FormSelect
					label={isArabic ? "نوع الهوية" : "ID Type"}
					name="id_type"
					options={getIdTypeOptions(isArabic)}
					value={formData.id_type}
					onChange={handleChange}
					required
					isArabic={isArabic}
					disabled={isSubmitting}
					placeholder={isArabic ? "اختر نوع الهوية" : "Select ID type"}
					helperText={isArabic ? "اختر نوع وثيقة الهوية الخاصة بك" : "Select your identity document type"}
				/>

				<FormInput
					label={isArabic ? "رقم الهوية" : "ID Number"}
					name="id_number"
					type="text"
					placeholder={isArabic ? "1234567890" : "1234567890"}
					value={formData.id_number}
					onChange={(e) => {
						// Only allow digits and limit to 10 characters
						const value = e.target.value.replace(/\D/g, '').slice(0, 10);
						setFormData((prev) => ({ ...prev, id_number: value }));
					}}
					required
					isArabic={isArabic}
					disabled={isSubmitting}
				/>
			</div>

			{/* File Upload Section */}
			<div className="mb-8">
				<UploadFileInput
					label={isArabic ? "صورة الهوية" : "ID Image"}
					endpoint="imageUploader"
					onUploadComplete={handleUploadComplete(
						"id_image",
						isArabic ? "تم رفع صورة الهوية بنجاح" : "ID image uploaded successfully",
					)}
					onUploadError={handleUploadError}
					isArabic={isArabic}
				/>
			</div>

			{/* Optional Fields Section */}
			<SectionHeader title={isArabic ? "حقول اختيارية" : "Optional Fields"} isArabic={isArabic} />
			<div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2 mb-8">
				{/* Zone Selection */}
				<FormSelect
					label={isArabic ? "المنطقة" : "Zone / Delivery Area"}
					name="zone_id"
					options={zones.map((zone) => ({ value: zone.id.toString(), label: zone.name }))}
					value={formData.zone_id}
					onChange={handleChange}
					isArabic={isArabic}
					disabled={loadingZones || isSubmitting}
					placeholder={
						loadingZones 
							? (isArabic ? "جاري التحميل..." : "Loading...") 
							: (isArabic ? "اختر المنطقة (اختياري)" : "Select Zone (Optional)")
					}
					helperText={isArabic ? "منطقة العمل (اختياري)" : "Work area (optional)"}
				/>

				{/* Module Selection */}
				<FormSelect
					label={isArabic ? "نوع الوحدة" : "Module Type"}
					name="module_id"
					options={modules.map((module) => ({ value: module.id.toString(), label: module.module_name || module.name }))}
					value={formData.module_id}
					onChange={handleChange}
					isArabic={isArabic}
					disabled={!formData.zone_id || loadingModules || isSubmitting}
					placeholder={
						!formData.zone_id 
							? (isArabic ? "اختر المنطقة أولاً" : "Select zone first")
							: loadingModules 
							? (isArabic ? "جاري التحميل..." : "Loading...") 
							: (isArabic ? "اختر نوع الوحدة (اختياري)" : "Select Module Type (Optional)")
					}
					helperText={isArabic ? "نوع الوحدة (اختياري)" : "Module type (optional)"}
				/>
			</div>

			{/* Form Actions */}
			<div className="mt-8 flex flex-col justify-start gap-4 sm:flex-row">
				<button
					type="submit"
					disabled={isSubmitting}
					className="w-full rounded-lg bg-green-500 dark:bg-green-600 px-10 py-3 font-semibold text-white shadow-sm transition-colors duration-300 hover:bg-green-600 dark:hover:bg-green-700 focus:ring-2 focus:ring-green-400 dark:focus:ring-green-500 focus:outline-none sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
				>
					{isSubmitting && (
						<svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
							<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
							<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
						</svg>
					)}
					{isSubmitting ? (isArabic ? "جاري الإرسال..." : "Submitting...") : (isArabic ? "إرسال الطلب" : "Submit Application")}
				</button>
				<button
					type="button"
					onClick={handleReset}
					disabled={isSubmitting}
					className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-10 py-3 font-semibold text-gray-500 dark:text-gray-300 shadow-sm transition-colors duration-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 focus:outline-none sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{isArabic ? "إعادة تعيين" : "Reset"}
				</button>
			</div>

			{/* Notifications */}
			<NotificationDialog
				isArabic={isArabic}
				message={notification.message}
				type={notification.type}
				isVisible={notification.isVisible}
				onClose={() => setNotification({ ...notification, isVisible: false })}
			/>
		</form>
	);
}

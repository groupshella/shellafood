"use client";

import { useLanguage } from "@/providers";
import {
	Autocomplete,
	GoogleMap,
	Marker,
} from "@react-google-maps/api";
import React from "react";
import { PhoneInput, NotificationDialog, FormInput, FormSelect, SectionHeader, CheckBoxInput, UploadFileInput } from "@/shared/components";
import { usePartnerRegistration } from "../../hooks/usePartnerRegistration";
import { usePartnerMap } from "../../hooks/usePartnerMap";
import type { PartnerFormData } from "../../types/partner.types";
import { PARTNER_CONSTANTS } from "../../constants/partner.constants";

const MAP_ZOOM = PARTNER_CONSTANTS.MAP_ZOOM;
const MAP_HEIGHT = PARTNER_CONSTANTS.MAP_HEIGHT;

const INITIAL_FORM_DATA: PartnerFormData = {
	f_name: "",
	l_name: "",
	phone: "",
	email: "",
	password: "",
	zoneId: "",
	moduleId: "",
	store_name: "",
	address: "",
	latitude: "",
	longitude: "",
	logo: new File([],"",{}),
	cover_photo: null,
	agreed: false,
};

export default function PartnerForm() {
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
		handleFileChange,
		handleSubmit,
		handleReset,
	} = usePartnerRegistration(INITIAL_FORM_DATA, language);

	const {
		isLoaded,
		autocompleteRef,
		handlePlaceChanged,
		handleLocationClick,
		handleGetCurrentLocation,
		mapCenter,
		markerPosition,
	} = usePartnerMap({
		formData,
		setFormData,
		setNotification,
		t,
	});

	return (
		<form onSubmit={handleSubmit} className="w-full">
			{/* Personal Information Section */}
			<SectionHeader title={isArabic ? "المعلومات الشخصية" : "Personal Information"} isArabic={isArabic} />
			<div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2 mb-8">
				<FormInput
					label={isArabic ? "الاسم الأول" : "First Name"}
					name="f_name"
					type="text"
					placeholder={isArabic ? "أدخل الاسم الأول" : "Enter first name"}
					value={formData.f_name}
					onChange={handleChange}
					required
					isArabic={isArabic}
					disabled={isSubmitting}
				/>

				<FormInput
					label={isArabic ? "اسم العائلة" : "Last Name"}
					name="l_name"
					type="text"
					placeholder={isArabic ? "أدخل اسم العائلة" : "Enter last name"}
					value={formData.l_name}
					onChange={handleChange}
					required
					isArabic={isArabic}
					disabled={isSubmitting}
				/>

				<PhoneInput
					label={isArabic ? "رقم الهاتف" : "Phone Number"}
					value={formData.phone}
					onChange={(phone) =>
						setFormData((prev) => ({ ...prev, phone: phone }))
					}
					isArabic={isArabic}
					required
					name="phone"
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

				<FormInput
					label={isArabic ? "كلمة المرور" : "Password"}
					name="password"
					type="password"
					placeholder={isArabic ? "8 أحرف على الأقل" : "At least 8 characters"}
					value={formData.password}
					onChange={handleChange}
					required
					isArabic={isArabic}
					disabled={isSubmitting}
				/>
			</div>

			{/* Store Information Section */}
			<SectionHeader title={isArabic ? "معلومات المتجر" : "Store Information"} isArabic={isArabic} />
			<div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2 mb-8">
				<FormSelect
					label={isArabic ? "المنطقة" : "Zone / Delivery Area"}
					name="zoneId"
					options={zones.map((zone) => ({ value: zone.id.toString(), label: zone.name }))}
					value={formData.zoneId}
					onChange={handleChange}
					required
					isArabic={isArabic}
					disabled={loadingZones || isSubmitting}
					placeholder={
						loadingZones 
							? (isArabic ? "جاري التحميل..." : "Loading...") 
							: (isArabic ? "اختر المنطقة" : "Select Zone")
					}
					helperText={isArabic ? "منطقة التوصيل الخاصة بمتجرك" : "Your store's delivery area"}
				/>

				<FormSelect
					label={isArabic ? "نوع المتجر" : "Store Type / Module"}
					name="moduleId"
					options={modules.map((module) => ({ value: module.id.toString(), label: module.module_name || module.name }))}
					value={formData.moduleId}
					onChange={handleChange}
					required
					isArabic={isArabic}
					disabled={!formData.zoneId || loadingModules || isSubmitting}
					placeholder={
						!formData.zoneId 
							? (isArabic ? "اختر المنطقة أولاً" : "Select zone first")
							: loadingModules 
							? (isArabic ? "جاري التحميل..." : "Loading...") 
							: (isArabic ? "اختر نوع المتجر" : "Select Store Type")
					}
					helperText={isArabic ? "نوع عملك (مطعم، بقالة، إلخ)" : "Your business type (restaurant, grocery, etc.)"}
				/>

				<FormInput
					label={isArabic ? "اسم المتجر" : "Store Name"}
					name="store_name"
					type="text"
					placeholder={isArabic ? "أدخل اسم المتجر" : "Enter store name"}
					value={formData.store_name}
					onChange={handleChange}
					required
					isArabic={isArabic}
					disabled={isSubmitting}
				/>

				<FormInput
					label={isArabic ? "عنوان المتجر" : "Store Address"}
					name="address"
					type="text"
					placeholder={isArabic ? "أدخل العنوان الكامل" : "Enter full address"}
					value={formData.address}
					onChange={handleChange}
					required
					isArabic={isArabic}
					disabled={isSubmitting}
				/>
			</div>

			{/* File Upload Section */}
			<SectionHeader title={isArabic ? "صور المتجر" : "Store Images"} isArabic={isArabic} />
			<div className="mt-6 flex flex-col gap-5 md:flex-row md:justify-start">
	

<UploadFileInput
					label={isArabic ? "شعار المتجر" : "Store Logo"}
					selectedFile={formData.logo}
					name="logo"
					onChange={handleFileChange}
					isArabic={isArabic}
					accept="image/*"
					required
					maxSizeMB={4}
				/>

				<UploadFileInput
					label={isArabic ? "صورة الغلاف" : "Cover Photo"}
					name="cover_photo"
					selectedFile={formData.cover_photo}
					onChange={handleFileChange}
					isArabic={isArabic}
					accept="image/*"
					maxSizeMB={4}
				/>
			</div>

			{/* Location Map Section */}
			<div className="mt-6 flex flex-col">
				<label className={`mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300 md:text-base ${isArabic ? "text-right" : "text-left"}`}>
					{t("partnerForm.location")}
					<span className="text-red-500 dark:text-red-400 mr-1">*</span>
				</label>

				<div className="relative" style={{ height: MAP_HEIGHT }}>
					{isLoaded && (
						<div className="absolute top-2 left-1/2 z-50 w-[300px] -translate-x-1/2">
							<Autocomplete
								onLoad={(ac) => (autocompleteRef.current = ac)}
								onPlaceChanged={handlePlaceChanged}
							>
								<input
									type="text"
									placeholder={t("partnerForm.searchLocation")}
									className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 px-4 py-2 shadow focus:border-green-500 dark:focus:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 dark:focus:ring-green-400/20"
								/>
							</Autocomplete>
						</div>
					)}

					{isLoaded ? (
						<>
							<GoogleMap
								mapContainerStyle={{ width: "100%", height: "100%" }}
								center={mapCenter}
								zoom={MAP_ZOOM}
								onClick={handleLocationClick}
							>
								{markerPosition && (
									<Marker position={markerPosition} />
								)}
							</GoogleMap>

							<button
								type="button"
								onClick={handleGetCurrentLocation}
								className="absolute top-14 right-0 z-50 rounded-lg bg-blue-500 dark:bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-blue-600 dark:hover:bg-blue-700"
							>
								{t("partnerForm.myLocation")}
							</button>
						</>
					) : (
						<div className="flex h-full items-center justify-center bg-gray-200 dark:bg-gray-800 rounded-lg">
							<p className="text-gray-600 dark:text-gray-400">{t("partnerForm.loadingMap")}</p>
						</div>
					)}
				</div>
			</div>

			{/* Terms Agreement */}
			<div className="mt-8">
				<CheckBoxInput
					checked={formData.agreed}
					onChange={handleChange}
					label={t("partnerForm.agreeTerms")}
					isArabic={isArabic}
					name="agreed"
					href="/CondtionAterms"
					linkText={t("partnerForm.termsAndConditions")}
					showLink={true}
					required
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
					{isSubmitting ? (isArabic ? "جاري الإرسال..." : "Submitting...") : t("partnerForm.submit")}
				</button>
				<button
					type="button"
					onClick={handleReset}
					disabled={isSubmitting}
					className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-10 py-3 font-semibold text-gray-500 dark:text-gray-300 shadow-sm transition-colors duration-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 focus:outline-none sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{t("partnerForm.reset")}
				</button>
			</div>

			{/* Notification Dialog */}
			<NotificationDialog
				isArabic={isArabic}
				message={notification.message}
				type={notification.type}
				isVisible={notification.isVisible}
				onClose={() => setNotification((prev) => ({ ...prev, isVisible: false }))}
			/>
		</form>
	);
}


"use client";

import { useLanguage } from "@/providers";
import React, { useState, useEffect } from "react";
import { PhoneInput } from "@/shared/components";
import { UploadFileInput, NotificationDialog, FormInput, SectionHeader, CheckBoxInput } from "@/shared/components";
import type { DriverFormData } from "../../types/driver.types";
import { useDriverRegistration } from "../../hooks/useDriverRegistration";

const INITIAL_FORM_DATA: DriverFormData = {
	f_name: "",
	l_name: "",
	phone: "",
	email: "",
	password: "",
	identity_number: "",
	identity_type: "",
	zone_id: "",
	identity_image:  null,
	driving_license_image:  null,
	driver_license_image:  null,
	agreed: false,
  };
  

export default function DriverForm() {
	const { t, language } = useLanguage();
	const isArabic = language === 'ar';
	const { 
		formData, 
		setFormData, 
		zones, 
		loadingZones, 
		isSubmitting, 
		notification, 
		setNotification,
		handleChange,
		handleFileChange,
		handleSubmit,
		handleReset,
		loadZones
	} = useDriverRegistration(INITIAL_FORM_DATA, language);

	// Load zones on mount
	useEffect(() => {
		loadZones();
	}, [language]);

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
					placeholder={isArabic ? "أدخل كلمة المرور" : "Enter password"}
					value={formData.password}
					onChange={handleChange}
					required
					isArabic={isArabic}
					disabled={isSubmitting}
				/>
			</div>

			{/* Driver Information Section */}
			<SectionHeader title={isArabic ? "معلومات السائق" : "Driver Information"} isArabic={isArabic} />
			<div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2 mb-8">
				<FormInput
					label={isArabic ? "رقم الهوية" : "Identity Number"}
					name="identity_number"
					type="text"
					placeholder={isArabic ? "1234567890" : "1234567890"}
					value={formData.identity_number}
					onChange={(e) => {
						// Only allow digits and limit to 10 characters
						const value = e.target.value.replace(/\D/g, '').slice(0, 10);
						setFormData((prev) => ({ ...prev, identity_number: value }));
					}}
					required
					isArabic={isArabic}
					disabled={isSubmitting}
				/>

				<div className="flex flex-col">
					<label
						htmlFor="identity_type"
						className={`mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300 md:text-base ${isArabic ? "text-right" : "text-left"}`}
					>
						{isArabic ? "نوع الهوية" : "Identity Type"}
						<span className="text-red-500 dark:text-red-400 mr-1">*</span>
					</label>
					<select
						id="identity_type"
						name="identity_type"
						value={formData.identity_type}
						onChange={handleChange}
						disabled={isSubmitting}
						className={`rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-3 focus:border-green-500 dark:focus:border-green-400 focus:ring-2 focus:ring-green-500/20 dark:focus:ring-green-400/20 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100 dark:disabled:bg-gray-800 ${isArabic ? "text-right" : "text-left"}`}
						required
					>
						<option value="">{isArabic ? "اختر نوع الهوية" : "Select identity type"}</option>
						<option value="nid">{isArabic ? "هوية وطنية" : "National ID"}</option>
						<option value="residence">{isArabic ? "إقامة" : "Iqama (Residence)"}</option>
						<option value="passport">{isArabic ? "رقم الجواز" : "Passport"}</option>
						<option value="driving_license">{isArabic ? "رخصة القيادة" : "Driving license"}</option>
					</select>
					<p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
						{isArabic ? "اختر نوع وثيقة الهوية الخاصة بك" : "Select your identity document type"}
					</p>
				</div>

				{/* Zone Selection */}
				<div className="flex flex-col">
					<label className={`mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300 md:text-base ${isArabic ? "text-right" : "text-left"}`}>
						{isArabic ? "المنطقة" : "Zone / Delivery Area"}
						<span className="text-red-500 dark:text-red-400 mr-1">*</span>
					</label>
					<select
						name="zone_id"
						value={formData.zone_id}
						onChange={handleChange}
						disabled={loadingZones || isSubmitting}
						className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 px-4 py-3 shadow-sm focus:border-green-500 dark:focus:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 dark:focus:ring-green-400/20 disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
						required
					>
						<option value="">
							{loadingZones 
								? (isArabic ? "جاري التحميل..." : "Loading...") 
								: (isArabic ? "اختر المنطقة" : "Select Zone")}
						</option>
						{zones.map((zone) => (
							<option key={zone.id} value={zone.id}>
								{zone.name}
							</option>
						))}
					</select>
					<p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
						{isArabic ? "منطقة العمل الخاصة بك" : "Your work area"}
					</p>
				</div>
			</div>

			{/* File Upload Section */}
			<SectionHeader title={isArabic ? "المستندات المطلوبة" : "Required Documents"} isArabic={isArabic} />
			<div className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-8">
				<UploadFileInput
				selectedFile={formData.identity_image}
					label={isArabic ? "صورة الهوية" : "Identity Image"}
					name="identity_image"
					onChange={handleFileChange}
					isArabic={isArabic}
					required
					accept="image/*"
					maxSizeMB={4}
				/>

				<UploadFileInput
					label={isArabic ? "رخصة القيادة" : "Driving License"}
					selectedFile={formData.driving_license_image}
					name="driving_license_image"
					onChange={handleFileChange}
					isArabic={isArabic}
					accept="image/*"
					maxSizeMB={4}
				/>

				<UploadFileInput
					label={isArabic ? "رخصة السائق" : "Driver License"}
					name="driver_license_image"
					selectedFile={formData.driver_license_image}
					onChange={handleFileChange}
					isArabic={isArabic}
					accept="image/*"
					maxSizeMB={4}
				/>
			</div>


			{/* Terms Agreement */}
			<div className="mt-8">
				<CheckBoxInput
					checked={formData.agreed}
					onChange={handleChange}
					label={isArabic ? "أوافق على" : "I agree to"}
					isArabic={isArabic}
					name="agreed"
					href="/CondtionAterms"
					linkText={isArabic ? "الشروط والأحكام" : "Terms and Conditions"}
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


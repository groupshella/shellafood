"use client";

import React, { useState } from "react";
import { useLanguage } from "@/providers";
import { PersonalInfoSection } from "./PersonalInfoSection";
import { AccountSection } from "./AccountSection";
import { NotificationDialog } from "@/shared/components";
import { useAuth } from "../hooks/useAuth";
import type { RegisterFormData, NotificationState } from "../types/auth.types";

/**
 * Main Register Form Component
 * Clean, modular registration form with API integration
 */
export default function RegisterForm() {
	const { t, language } = useLanguage();
	const isArabic = language === "ar";
	const { register: registerUser, isLoading, error, clearError } = useAuth();

	// Form State
	const [formData, setFormData] = useState<RegisterFormData>({
		first_name: "",
		last_name: "",
		phone: "",
		email: "",
		password: "",
		password_confirmation: "",
		accept_terms: false,
	});

	// UI State
	const [notification, setNotification] = useState<NotificationState>({
		message: "",
		type: "success",
		isVisible: false,
	});

	/**
	 * Handle input changes
	 */
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value, type, checked } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: type === 'checkbox' ? checked : value,
		}));
		// Clear error when user starts typing
		if (error) clearError();
	};

	/**
	 * Handle phone number change
	 */
	const handlePhoneChange = (phone: string) => {
		setFormData((prev) => ({ ...prev, phone }));
		// Clear error when user starts typing
		if (error) clearError();
	};

	/**
	 * Handle form submission
	 */
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		clearError();

		try {
			await registerUser(formData);

			setNotification({
				message: isArabic
					? "تم إنشاء الحساب بنجاح! سيتم تحويلك إلى الصفحة الرئيسية..."
					: "Account created successfully! Redirecting to home...",
				type: "success",
				isVisible: true,
			});
		} catch (error: any) {
			setNotification({
				message:  (isArabic
					? "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى."
					: "An unexpected error occurred. Please try again."),
				type: "error",
				isVisible: true,
			});
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12">
			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Header */}
				<div className={`text-center mb-8 ${isArabic ? 'text-right' : 'text-left'}`}>
					<h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 md:text-4xl">
						{t("register.title")}
					</h1>
					<p className="mt-2 text-gray-600 dark:text-gray-400">
						{t("register.subtitle")}
					</p>
				</div>

				{/* Form */}
				<form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900 p-6 md:p-8 space-y-8">
					{/* Personal Information */}
					<PersonalInfoSection
						first_name={formData.first_name}
						last_name={formData.last_name}
						phone={formData.phone}
						onChange={handleChange}
						onPhoneChange={handlePhoneChange}
						isArabic={isArabic}
						t={t}
						disabled={isLoading}
					/>

					{/* Account Information */}
					<AccountSection
						email={formData.email}
						password={formData.password}
						password_confirmation={formData.password_confirmation}
						accept_terms={formData.accept_terms}
						onChange={handleChange}
						isArabic={isArabic}
						t={t}
						disabled={isLoading}
					/>

					{/* Submit Button */}
					<div className="pt-6">
						<button
							type="submit"
							disabled={isLoading}
							className="w-full rounded-lg bg-green-600 px-6 py-4 text-lg font-semibold text-white transition-all hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-500/50 disabled:bg-gray-300 disabled:cursor-not-allowed"
						>
							{isLoading ? (
								<span className="flex items-center justify-center gap-2">
									<div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
									{isArabic ? "جاري التسجيل..." : "Registering..."}
								</span>
							) : (
								t("register.submit")
							)}
						</button>

						{/* Login Link */}
						<p className={`mt-4 text-center text-sm text-gray-600 dark:text-gray-400`}>
							{t("register.haveAccount")}{" "}
							<a href="/login" className="font-semibold text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300">
								{t("register.loginLink")}
							</a>
						</p>
					</div>
				</form>
			</div>

			{/* Notification Dialog */}
			<NotificationDialog
				isVisible={notification.isVisible}
				onClose={() => setNotification((prev) => ({ ...prev, isVisible: false }))}
				message={notification.message}
				type={notification.type}
				isArabic={isArabic}
			/>
		</div>
	);
}

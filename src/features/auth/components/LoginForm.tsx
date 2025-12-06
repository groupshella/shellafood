"use client";

import React, { useState } from "react";
import { useLanguage } from "@/providers";
import { NotificationDialog, FormInput, PasswordInput } from "@/shared/components";
import { useAuth } from "../hooks/useAuth";
import type { LoginFormData, NotificationState } from "../types/auth.types";

/**
 * Main Login Form Component
 * Clean, modular login form with RTL/LTR support
 */
export default function LoginForm() {
	const { t, language } = useLanguage();
	const isArabic = language === "ar";
	const { login, isLoading, error, clearError } = useAuth();

	// Form State
	const [formData, setFormData] = useState<LoginFormData>({
		email: "",
		password: "",
		remember: false,
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
	 * Handle form submission
	 */
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		clearError();

		try {
			await login(formData);

			setNotification({
				message: isArabic
					? "تم تسجيل الدخول بنجاح! جاري التحويل..."
					: "Login successful! Redirecting...",
				type: "success",
				isVisible: true,
			});
		} catch (error: any) {
			setNotification({
				message: (isArabic
					? "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى."
					: "An unexpected error occurred. Please try again."),
				type: "error",
				isVisible: true,
			});
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center py-8 sm:py-12">
			<div className="w-full max-w-[90%] sm:max-w-md lg:max-w-lg xl:max-w-xl mx-auto px-4">
				{/* Header */}
				<div className={`text-center mb-6 sm:mb-8 ${isArabic ? 'text-right' : 'text-left'}`}>
					<h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100">
						{t("login.title")}
					</h1>
					<p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-400">
						{t("login.subtitle")}
					</p>
				</div>

				{/* Form */}
				<form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900 p-6 sm:p-8 lg:p-10 space-y-5 sm:space-y-6">
					{/* Email */}
					<FormInput
						label={t("login.email")}
						name="email"
						type="email"
						value={formData.email}
						onChange={handleChange}
						placeholder={isArabic ? "example@email.com" : "example@email.com"}
						required
						isArabic={isArabic}
						disabled={isLoading}
					/>

					{/* Password */}
					<PasswordInput
						label={t("login.password")}
						name="password"
						value={formData.password}
						onChange={handleChange}
						placeholder={isArabic ? "أدخل كلمة المرور" : "Enter password"}
						required
						isArabic={isArabic}
						disabled={isLoading}
					/>

					{/* Remember Me */}
					<div className="flex items-center">
						<input
							type="checkbox"
							name="remember"
							checked={formData.remember}
							onChange={handleChange}
							className="rounded border-gray-300 text-green-600 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600"
							disabled={isLoading}
						/>
						<label className="mr-2 text-sm text-gray-700 dark:text-gray-300">
							{t("login.rememberMe")}
						</label>
					</div>

					{/* Submit Button */}
					<div className="pt-2 sm:pt-4">
						<button
							type="submit"
							disabled={isLoading}
							className="w-full rounded-lg bg-green-600 px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg font-semibold text-white transition-all hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-500/50 disabled:bg-gray-300 disabled:cursor-not-allowed"
						>
							{isLoading ? (
								<span className="flex items-center justify-center gap-2">
									<div className="h-4 w-4 sm:h-5 sm:w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
									<span className="text-sm sm:text-base">
										{isArabic ? "جاري تسجيل الدخول..." : "Logging in..."}
									</span>
								</span>
							) : (
								t("login.submit")
							)}
						</button>

						{/* Register Link */}
						<p className={`mt-4 text-center text-xs sm:text-sm text-gray-600 dark:text-gray-400`}>
							{t("login.noAccount")}{" "}
							<a href="/register" className="font-semibold text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 hover:underline">
								{t("login.registerLink")}
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

"use client";

import React, { useState, useCallback } from "react";
import { useLanguage } from "@/providers";
import { PersonalInfoSection } from "./PersonalInfoSection";
import { AccountSection } from "./AccountSection";
import { NotificationDialog } from "@/shared/components";
import type { RegisterFormData, NotificationState } from "../types/auth.types";
import { AUTH_ROUTES, DEFAULT_LANG } from "../constants/auth.constants";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function RegisterForm() {
	const { t, language } = useLanguage();
	const isArabic = language === "ar";
	const router = useRouter();

	// ============================================================================
	// STATE
	// ============================================================================

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

	// Registration flow state
	const [registrationStep, setRegistrationStep] = useState<'form' | 'otp'>('form');
	const [registrationToken, setRegistrationToken] = useState<string | null>(null);
	const [otp, setOtp] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [isResendingOtp, setIsResendingOtp] = useState(false);

	// UI State
	const [notification, setNotification] = useState<NotificationState>({
		message: "",
		type: "success",
		isVisible: false,
	});

	// ============================================================================
	// HANDLERS
	// ============================================================================

	const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value, type, checked } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: type === 'checkbox' ? checked : value,
		}));
	}, []);

	const handlePhoneChange = useCallback((phone: string) => {
		setFormData((prev) => ({ ...prev, phone }));
	}, []);

	const handleOtpChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value.replace(/\D/g, '').slice(0, 6); // Only digits, max 6
		setOtp(value);
	}, []);

	/**
	 * Handle registration form submission
	 */
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// Validation
		if (!formData.first_name || !formData.last_name || !formData.phone || !formData.email || !formData.password) {
			setNotification({
				message: isArabic
					? "يرجى ملء جميع الحقول المطلوبة"
					: "Please fill in all required fields",
				type: "error",
				isVisible: true,
			});
			return;
		}

		if (formData.password !== formData.password_confirmation) {
			setNotification({
				message: isArabic
					? "كلمات المرور غير متطابقة"
					: "Passwords do not match",
				type: "error",
				isVisible: true,
			});
			return;
		}

		if (!formData.accept_terms) {
			setNotification({
				message: isArabic
					? "يجب الموافقة على الشروط والأحكام"
					: "You must accept the terms and conditions",
				type: "error",
				isVisible: true,
			});
			return;
		}

		setIsLoading(true);

		try {
			const response = await fetch('/api/auth/register', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					name: `${formData.first_name} ${formData.last_name}`,
					phone: formData.phone,
					email: formData.email,
					password: formData.password,
					ref_code: '',
					guest_id: '',
					lang: language || DEFAULT_LANG,
				}),
			});

			const data = await response.json();

		console.log("data in register", data);
		if(!data.success)
		{
			setNotification({
				message: data.message|| (isArabic
					? "فشل التسجيل"
					: "Registration failed"),
				type: "error",
				isVisible: true,
			});
		}
			else {
				setRegistrationStep('otp');
				setNotification({
					message:  (isArabic
						? "تم إرسال رمز التحقق إلى هاتفك"
						: "OTP sent to your phone"),
					type: "success",
					isVisible: true,
				});
			} 

		} catch (error: any) {
			console.error('[Register Form] Error:', error);
			
			setNotification({
				message: error.message || (isArabic
					? "فشل التسجيل. يرجى المحاولة مرة أخرى."
					: "Registration failed. Please try again."),
				type: "error",
				isVisible: true,
			});
		} finally {
			setIsLoading(false);
		}
	};

	/**
	 * Handle OTP verification
	 */
	const handleVerifyOtp = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!otp || otp.length < 4) {
			setNotification({
				message: isArabic
					? "يرجى إدخال رمز التحقق"
					: "Please enter the verification code",
				type: "error",
				isVisible: true,
			});
			return;
		}

		setIsLoading(true);

		try {
			const response = await fetch('/api/auth/verify-otp', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					phone: formData.phone,
					otp: otp,
					token: registrationToken,
					lang: language || DEFAULT_LANG,
				}),
			});

			const data = await response.json();

			if (!response.ok || !data.success) {
				throw new Error(data.message || (isArabic ? 'فشل التحقق من الرمز' : 'OTP verification failed'));
			}

			// Success
			setNotification({
				message: isArabic
					? "تم التحقق بنجاح! جاري التحويل..."
					: "Verification successful! Redirecting...",
				type: "success",
				isVisible: true,
			});

			setTimeout(() => {
				router.push(AUTH_ROUTES.HOME);
				router.refresh();
			}, 1000);

		} catch (error: any) {
			console.error('[OTP Verification] Error:', error);
			
			setNotification({
				message: error.message || (isArabic
					? "رمز التحقق غير صحيح أو منتهي الصلاحية"
					: "Invalid or expired verification code"),
				type: "error",
				isVisible: true,
			});
		} finally {
			setIsLoading(false);
		}
	};

	/**
	 * Handle resend OTP
	 */
	const handleResendOtp = async () => {
		setIsResendingOtp(true);

		try {
			const response = await fetch('/api/auth/resend-otp', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					phone: formData.phone,
					lang: language || DEFAULT_LANG,
				}),
			});

			const data = await response.json();

			if (!response.ok || !data.success) {
				throw new Error(data.message || (isArabic ? 'فشل إعادة إرسال الرمز' : 'Failed to resend OTP'));
			}

			setNotification({
				message: data.message || (isArabic
					? "تم إعادة إرسال رمز التحقق"
					: "OTP resent successfully"),
				type: "success",
				isVisible: true,
			});

		} catch (error: any) {
			console.error('[Resend OTP] Error:', error);
			
			setNotification({
				message: error.message || (isArabic
					? "فشل إعادة إرسال الرمز. يرجى المحاولة مرة أخرى."
					: "Failed to resend OTP. Please try again."),
				type: "error",
				isVisible: true,
			});
		} finally {
			setIsResendingOtp(false);
		}
	};

	/**
	 * Handle guest registration
	 */
	const handleGuestRegister = async () => {
		setIsLoading(true);

		try {
			const response = await fetch('/api/auth/guest/request', {
				method: 'POST',
				headers: {
					'X-LANG': language || DEFAULT_LANG,
					'Content-Type': 'application/json',
				},
			});

			const data = await response.json();

			if (!response.ok || !data.success) {
				throw new Error( (isArabic ? 'فشل التسجيل كضيف' : 'Guest registration failed'));
			}


			setNotification({
				message:  (isArabic
					? "تم التسجيل كضيف بنجاح! جاري التحويل..."
					: "Guest registration successful! Redirecting..."),
				type: "success",
				isVisible: true,
			});

			setTimeout(() => {
				router.push(AUTH_ROUTES.HOME);
				router.refresh();
			}, 1000);

		} catch (error: any) {
			console.error('[Guest Registration] Error:', error);
			
			setNotification({
				message:  (isArabic
					? "فشل التسجيل كضيف. يرجى المحاولة مرة أخرى."
					: "Guest registration failed. Please try again."),
				type: "error",
				isVisible: true,
			});
		} finally {
			setIsLoading(false);
		}
	};

	// ============================================================================
	// RENDER
	// ============================================================================

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 sm:py-12">
			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
				
				{/* Header */}
				<div className={`text-center mb-6 sm:mb-8 ${isArabic ? 'text-right' : 'text-left'}`}>
					<h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100">
						{registrationStep === 'form' 
							? (t("register.title") || (isArabic ? "إنشاء حساب جديد" : "Create New Account"))
							: (isArabic ? "تحقق من رقم الهاتف" : "Verify Phone Number")
						}
					</h1>
					<p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-400">
						{registrationStep === 'form'
							? (t("register.subtitle") || (isArabic ? "أدخل معلوماتك لإنشاء حساب" : "Enter your information to create an account"))
							: (isArabic ? "أدخل رمز التحقق المرسل إلى هاتفك" : "Enter the verification code sent to your phone")
						}
					</p>
				</div>

				<AnimatePresence mode="wait">
					{registrationStep === 'form' ? (
						/* Registration Form */
						<motion.form
							key="form"
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: 20 }}
							onSubmit={handleSubmit}
							className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900 p-6 md:p-8 space-y-8"
						>
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
									className="w-full rounded-lg bg-green-600 px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg font-semibold text-white transition-all hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-500/50 disabled:bg-gray-400 disabled:cursor-not-allowed active:scale-95"
								>
									{isLoading ? (
										<span className="flex items-center justify-center gap-2">
											<div className="h-4 w-4 sm:h-5 sm:w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
											<span className="text-sm sm:text-base">
												{isArabic ? "جاري التسجيل..." : "Registering..."}
											</span>
										</span>
									) : (
										t("register.submit") || (isArabic ? "إنشاء حساب" : "Create Account")
									)}
								</button>

								{/* Login Link */}
								<p className="mt-4 text-center text-xs sm:text-sm text-gray-600 dark:text-gray-400">
									{t("register.haveAccount") || (isArabic ? "لديك حساب؟" : "Already have an account?")}{" "}
									<a 
										href="/login" 
										className="font-semibold text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 hover:underline"
									>
										{t("register.loginLink") || (isArabic ? "سجل الدخول" : "Login")}
									</a>
								</p>

								{/* Guest Registration Link */}
								<div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
									<div className="flex items-center gap-3 mb-4">
										<div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
										<p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
											{isArabic ? "أو" : "Or"}
										</p>
										<div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
									</div>
									<button
										type="button"
										onClick={handleGuestRegister}
										disabled={isLoading}
										className="w-full rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 sm:px-6 py-3 sm:py-3.5 text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300 transition-all hover:border-green-500 dark:hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-700 dark:hover:text-green-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-300 disabled:hover:bg-white disabled:hover:text-gray-700 active:scale-95"
									>
										{isLoading ? (
											<span className="flex items-center justify-center gap-2">
												<div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-400 border-t-transparent"></div>
												<span className="text-sm sm:text-base">
													{isArabic ? "جاري التحميل..." : "Loading..."}
												</span>
											</span>
										) : (
											<span>{isArabic ? "المتابعة كضيف" : "Continue as Guest"}</span>
										)}
									</button>
								</div>
							</div>
						</motion.form>
					) : (
						/* OTP Verification Form */
						<motion.form
							key="otp"
							initial={{ opacity: 0, x: 20 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: -20 }}
							onSubmit={handleVerifyOtp}
							className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900 p-6 md:p-8 space-y-6"
						>
							{/* Phone Display */}
							<div className="text-center">
								<p className="text-sm text-gray-600 dark:text-gray-400">
									{isArabic ? "تم إرسال الرمز إلى" : "Code sent to"}
								</p>
								<p className="text-lg font-bold text-gray-900 dark:text-white mt-1" dir="ltr">
									{formData.phone}
								</p>
							</div>

							{/* OTP Input */}
							<div>
								<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
									{isArabic ? "رمز التحقق" : "Verification Code"}
								</label>
								<input
									type="text"
									inputMode="numeric"
									pattern="[0-9]*"
									value={otp}
									onChange={handleOtpChange}
									placeholder={isArabic ? "أدخل الرمز" : "Enter code"}
									maxLength={6}
									disabled={isLoading}
									className="w-full px-4 py-3 text-center text-2xl tracking-widest font-bold border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600"
									dir="ltr"
									required
								/>
							</div>

							{/* Verify Button */}
							<button
								type="submit"
								disabled={isLoading}
								className="w-full rounded-lg bg-green-600 px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg font-semibold text-white transition-all hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-500/50 disabled:bg-gray-400 disabled:cursor-not-allowed active:scale-95"
							>
								{isLoading ? (
									<span className="flex items-center justify-center gap-2">
										<div className="h-4 w-4 sm:h-5 sm:w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
										<span className="text-sm sm:text-base">
											{isArabic ? "جاري التحقق..." : "Verifying..."}
										</span>
									</span>
								) : (
									isArabic ? "تحقق من الرمز" : "Verify Code"
								)}
							</button>

							{/* Resend OTP */}
							<div className="text-center">
								<p className="text-sm text-gray-600 dark:text-gray-400">
									{isArabic ? "لم تستلم الرمز؟" : "Didn't receive the code?"}
								</p>
								<button
									type="button"
									onClick={handleResendOtp}
									disabled={isResendingOtp}
									className="mt-2 text-sm font-semibold text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
								>
									{isResendingOtp 
										? (isArabic ? "جاري الإرسال..." : "Sending...")
										: (isArabic ? "إعادة إرسال الرمز" : "Resend Code")
									}
								</button>
							</div>

							{/* Back to Form */}
							<button
								type="button"
								onClick={() => setRegistrationStep('form')}
								className="w-full text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
							>
								{isArabic ? "← العودة للتسجيل" : "← Back to Registration"}
							</button>
						</motion.form>
					)}
				</AnimatePresence>
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

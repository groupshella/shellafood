"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/providers";
import { NotificationDialog } from "@/shared/components";
import { AUTH_ROUTES, DEFAULT_LANG } from "../constants/auth.constants";
import type { NotificationState } from "../types/auth.types";

type PendingLoginOtp = {
	phone: string;
	remember?: boolean;
};

const PENDING_LOGIN_OTP_STORAGE_KEY = "pending_login_otp";

export default function LoginOtpForm() {
	const { language } = useLanguage();
	const isArabic = language === "ar";
	const router = useRouter();

	const [pendingLogin, setPendingLogin] = useState<PendingLoginOtp | null>(null);
	const [isReady, setIsReady] = useState(false);
	const [otp, setOtp] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [isResendingOtp, setIsResendingOtp] = useState(false);

	const [notification, setNotification] = useState<NotificationState>({
		message: "",
		type: "success",
		isVisible: false,
	});

	useEffect(() => {
		try {
			const storedPayload = window.sessionStorage.getItem(PENDING_LOGIN_OTP_STORAGE_KEY);

			if (!storedPayload) {
				setPendingLogin(null);
				return;
			}

			const parsedPayload = JSON.parse(storedPayload) as PendingLoginOtp;

			if (!parsedPayload?.phone) {
				setPendingLogin(null);
				return;
			}

			setPendingLogin({
				phone: parsedPayload.phone,
				remember: Boolean(parsedPayload.remember),
			});
		} catch (error) {
			console.error("[Login OTP] Failed to restore pending OTP state:", error);
			setPendingLogin(null);
		} finally {
			setIsReady(true);
		}
	}, []);

	const handleOtpChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value.replace(/\D/g, "").slice(0, 6);
		setOtp(value);
	}, []);

	const handleVerifyOtp = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!pendingLogin?.phone) {
			setNotification({
				message: isArabic
					? "انتهت جلسة التحقق. يرجى تسجيل الدخول مرة أخرى."
					: "Verification session expired. Please log in again.",
				type: "error",
				isVisible: true,
			});
			return;
		}

		if (otp.length !== 6) {
			setNotification({
				message: isArabic
					? "يرجى إدخال رمز التحقق المكوّن من 6 أرقام"
					: "Please enter the 6-digit verification code",
				type: "error",
				isVisible: true,
			});
			return;
		}

		setIsLoading(true);

		try {
			const response = await fetch("/api/auth/login/verify-otp", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					phone: pendingLogin.phone,
					otp,
					remember: Boolean(pendingLogin.remember),
					lang: language || DEFAULT_LANG,
				}),
			});

			const data = await response.json();

			if (!response.ok || !data.success) {
				throw new Error(
					data.message ||
						(isArabic
							? "رمز التحقق غير صحيح أو منتهي الصلاحية"
							: "Invalid or expired verification code")
				);
			}

			window.sessionStorage.removeItem(PENDING_LOGIN_OTP_STORAGE_KEY);

			setNotification({
				message: isArabic
					? "تم تسجيل الدخول بنجاح! جاري التحويل..."
					: "Login successful! Redirecting...",
				type: "success",
				isVisible: true,
			});

			setTimeout(() => {
				router.push(AUTH_ROUTES.HOME);
				router.refresh();
			}, 900);
		} catch (error: any) {
			console.error("[Login OTP Verification] Error:", error);

			setNotification({
				message:
					error.message ||
					(isArabic
						? "رمز التحقق غير صحيح أو منتهي الصلاحية"
						: "Invalid or expired verification code"),
				type: "error",
				isVisible: true,
			});
		} finally {
			setIsLoading(false);
		}
	};

	const handleResendOtp = async () => {
		if (!pendingLogin?.phone) {
			setNotification({
				message: isArabic
					? "انتهت جلسة التحقق. يرجى تسجيل الدخول مرة أخرى."
					: "Verification session expired. Please log in again.",
				type: "error",
				isVisible: true,
			});
			return;
		}

		setIsResendingOtp(true);

		try {
			const response = await fetch("/api/auth/login/resend-otp", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					phone: pendingLogin.phone,
					lang: language || DEFAULT_LANG,
				}),
			});

			const data = await response.json();

			if (!response.ok || !data.success) {
				throw new Error(
					data.message ||
						(isArabic
							? "فشل إعادة إرسال الرمز"
							: "Failed to resend OTP")
				);
			}

			setNotification({
				message:
					data.message ||
					(isArabic
						? "تم إعادة إرسال رمز التحقق"
						: "OTP resent successfully"),
				type: "success",
				isVisible: true,
			});
		} catch (error: any) {
			console.error("[Login OTP Resend] Error:", error);

			setNotification({
				message:
					error.message ||
					(isArabic
						? "فشل إعادة إرسال الرمز. يرجى المحاولة مرة أخرى."
						: "Failed to resend OTP. Please try again."),
				type: "error",
				isVisible: true,
			});
		} finally {
			setIsResendingOtp(false);
		}
	};

	const handleBackToLogin = () => {
		window.sessionStorage.removeItem(PENDING_LOGIN_OTP_STORAGE_KEY);
		router.push(AUTH_ROUTES.LOGIN);
	};

	if (!isReady) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center py-8 sm:py-12">
				<div className="w-full max-w-[90%] sm:max-w-md lg:max-w-lg xl:max-w-xl mx-auto px-4">
					<div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900 p-6 sm:p-8 lg:p-10">
						<div className="flex items-center justify-center gap-3 text-gray-700 dark:text-gray-200">
							<div className="h-5 w-5 animate-spin rounded-full border-2 border-green-600 border-t-transparent"></div>
							<span>{isArabic ? "جاري التحميل..." : "Loading..."}</span>
						</div>
					</div>
				</div>
			</div>
		);
	}

	if (!pendingLogin) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center py-8 sm:py-12">
				<div className="w-full max-w-[90%] sm:max-w-md lg:max-w-lg xl:max-w-xl mx-auto px-4">
					<div className={`text-center mb-6 sm:mb-8 ${isArabic ? "text-right" : "text-left"}`}>
						<h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100">
							{isArabic ? "جلسة التحقق غير متاحة" : "Verification session unavailable"}
						</h1>
						<p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-400">
							{isArabic
								? "يرجى العودة إلى تسجيل الدخول وإرسال رمز جديد."
								: "Please return to login and request a new verification code."}
						</p>
					</div>

					<div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900 p-6 sm:p-8 lg:p-10">
						<button
							type="button"
							onClick={handleBackToLogin}
							className="w-full rounded-lg bg-green-600 px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg font-semibold text-white transition-all hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-500/50 active:scale-95"
						>
							{isArabic ? "العودة لتسجيل الدخول" : "Back to Login"}
						</button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center py-8 sm:py-12">
			<div className="w-full max-w-[90%] sm:max-w-md lg:max-w-lg xl:max-w-xl mx-auto px-4">
				<div className={`text-center mb-6 sm:mb-8 ${isArabic ? "text-right" : "text-left"}`}>
					<h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100">
						{isArabic ? "تحقق من تسجيل الدخول" : "Verify Login"}
					</h1>
					<p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-400">
						{isArabic
							? "أدخل رمز التحقق المرسل إلى رقم هاتفك"
							: "Enter the verification code sent to your phone"}
					</p>
				</div>

				<form
					onSubmit={handleVerifyOtp}
					className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900 p-6 sm:p-8 lg:p-10 space-y-6"
				>
					<div className="text-center">
						<p className="text-sm text-gray-600 dark:text-gray-400">
							{isArabic ? "تم إرسال الرمز إلى" : "Code sent to"}
						</p>
						<p className="text-lg font-bold text-gray-900 dark:text-white mt-1" dir="ltr">
							{pendingLogin.phone}
						</p>
					</div>

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
								? isArabic
									? "جاري الإرسال..."
									: "Sending..."
								: isArabic
									? "إعادة إرسال الرمز"
									: "Resend Code"}
						</button>
					</div>

					<button
						type="button"
						onClick={handleBackToLogin}
						className="w-full text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
					>
						{isArabic ? "← العودة لتسجيل الدخول" : "← Back to Login"}
					</button>
				</form>
			</div>

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

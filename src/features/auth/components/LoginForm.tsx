"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/providers";
import { NotificationDialog, PasswordInput } from "@/shared/components";
import { PhoneInput } from "@/shared/components/forms";
import type { LoginFormData, NotificationState } from "../types/auth.types";
import { AUTH_ROUTES, DEFAULT_LANG } from "../constants/auth.constants";

export default function LoginForm() {
  const { t, language } = useLanguage();
  const isArabic = language === "ar";
  const router = useRouter();

  // ============================================================================
  // STATE
  // ============================================================================

  const [formData, setFormData] = useState<LoginFormData>({
    phone: "",
    password: "",
    remember: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<NotificationState>({
    message: "",
    type: "success",
    isVisible: false,
  });

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handlePhoneChange = useCallback((phone: string) => {
    setFormData((prev) => ({ ...prev, phone }));

  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }, []);

  const handleForgotPassword = useCallback(async () => {
    // Validate phone number
    if (!formData.phone || formData.phone === "+966") {
      setNotification({
        message: isArabic
          ? "يرجى إدخال رقم الهاتف أولاً"
          : "Please enter your phone number first",
        type: "error",
        isVisible: true,
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email_or_phone: formData.phone,
          field_type: 'phone',
        }),
      });

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error(
          isArabic
            ? "فشل إرسال رابط إعادة تعيين كلمة المرور. يرجى المحاولة مرة أخرى."
            : "Failed to send password reset link. Please try again."
        );
      }

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
          (isArabic
            ? "فشل إرسال رابط إعادة تعيين كلمة المرور. يرجى المحاولة مرة أخرى."
            : "Failed to send password reset link. Please try again.")
        );
      }

      // Success
      setNotification({
        message: isArabic
          ? "تم إرسال رابط إعادة تعيين كلمة المرور إلى رقم هاتفك"
          : "Password reset link has been sent to your phone number",
        type: "success",
        isVisible: true,
      });

    } catch (error: any) {
      console.error('[Forgot Password] Error:', error);

      setNotification({
        message: error.message ||
          (isArabic
            ? "فشل إرسال رابط إعادة تعيين كلمة المرور. يرجى المحاولة مرة أخرى."
            : "Failed to send password reset link. Please try again."),
        type: "error",
        isVisible: true,
      });
    } finally {
      setIsLoading(false);
    }
  }, [formData.phone, isArabic]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.phone || formData.phone === "+966" || !formData.password) {
      setNotification({
        message: isArabic
          ? "يرجى ملء جميع الحقول المطلوبة"
          : "Please fill in all required fields",
        type: "error",
        isVisible: true,
      });
      return;
    }
    console.log("formData", formData);

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          login_type: 'manual',
          email_or_phone: formData.phone,
          field_type: 'phone',
          password: formData.password,
          guest_id: '',
          remember: formData.remember, // For cookie duration only, not sent to backend
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success || !data.data?.otp_required) {
        throw new Error(
          data.message ||
          (isArabic
            ? "فشل تسجيل الدخول. يرجى التحقق من رقم الهاتف وكلمة المرور."
            : "Login failed. Please check your phone number and password.")
        );
      }
      window.sessionStorage.setItem(
        "pending_login_otp",
        JSON.stringify({
          phone: data.data.phone || formData.phone,
          remember: Boolean(formData.remember),
        })
      );

      setNotification({
        message: isArabic
          ? "تم إرسال رمز التحقق إلى هاتفك"
          : "Verification code sent to your phone",
        type: "success",
        isVisible: true,
      });

      setTimeout(() => {
        router.push(`/login/verify-otp`);
      }, 700);

    } catch (error: any) {
      console.error('[Login Form] Error:', error);

      setNotification({
        message: error.message || (isArabic
          ? "فشل تسجيل الدخول. يرجى التحقق من رقم الهاتف وكلمة المرور."
          : "Login failed. Please check your phone number and password."),
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
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900 p-6 sm:p-8 lg:p-10 space-y-5 sm:space-y-6"
        >

          {/* Phone Number */}
          <PhoneInput
            label={(isArabic ? "رقم الهاتف" : "Phone Number")}
            value={formData.phone}
            onChange={handlePhoneChange}
            isArabic={isArabic}
            required
            name="phone"
            disabled={isLoading}
          />

          {/* Password */}
          <div>
            <PasswordInput
              label={t("login.password") || (isArabic ? "كلمة المرور" : "Password")}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder={isArabic ? "أدخل كلمة المرور" : "Enter password"}
              required
              isArabic={isArabic}
              disabled={isLoading}
            />
            {/* Forgot Password Link */}
            <div className={`mt-2 ${isArabic ? 'text-left' : 'text-right'}`}>
              <button
                type="button"
                onClick={handleForgotPassword}
                disabled={isLoading}
                className="text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 hover:underline font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isArabic ? "نسيت كلمة المرور؟" : "Forgot password?"}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="remember"
              name="remember"
              checked={formData.remember}
              onChange={handleChange}
              className="rounded border-gray-300 text-green-600 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600"
              disabled={isLoading}
            />
            <label
              htmlFor="remember"
              className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
            >
              {isArabic ? "تذكرني" : "Remember me"}
            </label>
          </div>

          {/* Submit Button */}
          <div className="pt-2 sm:pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-green-600 px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg font-semibold text-white transition-all hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-500/50 disabled:bg-gray-400 disabled:cursor-not-allowed active:scale-95"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="h-4 w-4 sm:h-5 sm:w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  <span className="text-sm sm:text-base">
                    {isArabic ? "جاري تسجيل الدخول..." : "Logging in..."}
                  </span>
                </span>
              ) : (
                t("login.submit") || (isArabic ? "تسجيل الدخول" : "Login")
              )}
            </button>

            {/* Register Link */}
            <p className="mt-4 text-center text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              {t("login.noAccount") || (isArabic ? "ليس لديك حساب؟" : "Don't have an account?")}{" "}
              <a
                href="/register"
                className="font-semibold text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 hover:underline"
              >
                {t("login.registerLink") || (isArabic ? "سجل الآن" : "Register now")}
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
"use client";

import LoginScreen from "@/features/auth/components/LoginScreen";
import CreateAccountScreen from "@/features/auth/components/CreateAccountScreen";
import ForgotPasswordScreen from "@/features/auth/components/ForgotPasswordScreen";
import OtpScreen from "@/features/auth/components/OtpScreen";
import NewPasswordScreen from "@/features/auth/components/NewPasswordScreen";
import SuccessScreen from "@/features/auth/components/SuccessScreen";
import { useAuth } from "@/features/auth/hooks/useAuth";

export default function AuthFlowPage() {
    const {
        step,
        phone,
        otpFlow,
        isLoading,
        error,
        infoMessage,
        cooldownSeconds,
        handleLogin,
        handleRegister,
        handleVerifyOtp,
        handleResendOtp,
        handleForgotPasswordSubmit,
        handleResetPassword,
        handleGuest,
        clearError,
        goBack,
        goToRegister,
        goToForgotPassword,
        goToLogin,
        goToLoginWithPhone,
        goToForgotPasswordWithPhone,
        prefillPhone,
    } = useAuth();

    return (
        <>
            {step === "login" && (
                <LoginScreen
                    isLoading={isLoading}
                    error={error}
                    infoMessage={infoMessage}
                    prefillPhone={prefillPhone}
                    onLogin={handleLogin}
                    onForgotPassword={goToForgotPassword}
                    onRegister={goToRegister}
                    onGuest={handleGuest}
                    onApple={() => { }}
                    onGoogle={() => { }}
                />
            )}

            {step === "register" && (
                <CreateAccountScreen
                    isLoading={isLoading}
                    error={error}
                    onBack={goBack}
                    onGoToLogin={goToLoginWithPhone}
                    onForgotPassword={goToForgotPasswordWithPhone}
                    onCreate={handleRegister}
                />
            )}

            {step === "forgot-phone" && (
                <ForgotPasswordScreen
                    isLoading={isLoading}
                    error={error}
                    prefillPhone={prefillPhone}
                    onBack={goBack}
                    onSubmit={handleForgotPasswordSubmit}
                />
            )}

            {step === "otp" && (
                <OtpScreen
                    phone={phone}
                    otpFlow={otpFlow}
                    cooldownSeconds={cooldownSeconds}
                    isLoading={isLoading}
                    error={error}
                    onBack={goBack}
                    clearError={clearError}
                    onVerify={handleVerifyOtp}
                    onResend={handleResendOtp}
                />
            )}

            {step === "new-password" && (
                <NewPasswordScreen
                    isLoading={isLoading}
                    error={error}
                    onBack={goBack}
                    onSubmit={handleResetPassword}
                />
            )}

            {step === "register-success" && (
                <SuccessScreen
                    title="تم إنشاء حسابك بنجاح"
                    subtitle="يمكنك الان استخدام جميع خدمات التطبيق"
                    buttonLabel="بدء الاستخدام"
                    onAction={goToLogin}
                />
            )}

            {step === "reset-success" && (
                <SuccessScreen
                    title="تم تغيير كلمة المرور بنجاح"
                    subtitle="يمكنك الان الدخول عن طريق كلمة المرور الجديدة"
                    buttonLabel="تسجيل الدخول"
                    onAction={goToLogin}
                />
            )}
        </>
    );
}
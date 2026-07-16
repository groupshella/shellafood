"use client";

import LoginScreen from "@/features/auth/components/LoginScreen";
import CreateAccountScreen from "@/features/auth/components/CreateAccountScreen";
import ForgotPasswordScreen from "@/features/auth/components/ForgotPasswordScreen";
import OtpScreen from "@/features/auth/components/OtpScreen";
import NewPasswordScreen from "@/features/auth/components/NewPasswordScreen";
import SuccessScreen from "@/features/auth/components/SuccessScreen";
import { useAuth } from "@/features/auth/hooks/useAuth";

export default function AuthFlowPage({ isArabic }: { isArabic: boolean }) {
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
					isArabic={isArabic}
					isLoading={isLoading}
					error={error}
					infoMessage={infoMessage}
					prefillPhone={prefillPhone}
					onLogin={handleLogin}
					onForgotPassword={goToForgotPassword}
					onRegister={goToRegister}
					onGuest={handleGuest}
					onApple={() => {}}
					onGoogle={() => {}}
				/>
			)}

			{step === "register" && (
				<CreateAccountScreen
					isArabic={isArabic}
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
					isArabic={isArabic}
					isLoading={isLoading}
					error={error}
					prefillPhone={prefillPhone}
					onBack={goBack}
					onSubmit={handleForgotPasswordSubmit}
				/>
			)}

			{step === "otp" && (
				<OtpScreen
					isArabic={isArabic}
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
					isArabic={isArabic}
					isLoading={isLoading}
					error={error}
					onBack={goBack}
					onSubmit={handleResetPassword}
				/>
			)}

			{step === "register-success" && (
				<SuccessScreen
					isArabic={isArabic}
					title={
						isArabic
							? "تم إنشاء حسابك بنجاح"
							: "Your account was created successfully"
					}
					subtitle={
						isArabic
							? "يمكنك الان استخدام جميع خدمات التطبيق"
							: "You can now use all app services"
					}
					buttonLabel={isArabic ? "بدء الاستخدام" : "Get started"}
					onAction={goToLogin}
				/>
			)}

			{step === "reset-success" && (
				<SuccessScreen
					isArabic={isArabic}
					title={
						isArabic
							? "تم تغيير كلمة المرور بنجاح"
							: "Password changed successfully"
					}
					subtitle={
						isArabic
							? "يمكنك الان الدخول عن طريق كلمة المرور الجديدة"
							: "You can now sign in with your new password"
					}
					buttonLabel={isArabic ? "تسجيل الدخول" : "Sign in"}
					onAction={goToLogin}
				/>
			)}
		</>
	);
}

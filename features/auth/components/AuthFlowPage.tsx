"use client";

import WelcomeScreen from "@/features/auth/components/WelcomeScreen";
import EnterPhoneScreen from "@/features/auth/components/EnterPhoneScreen";
import OtpScreen from "@/features/auth/components/OtpScreen";
import CreateAccountScreen from "@/features/auth/components/CreateAccountScreen";
import { useAuth } from "@/features/auth/hooks/useAuth";

export default function AuthFlowPage() {
    const {
        step,
        phone,
        isLoading,
        error,
        cooldownSeconds,
        handleSendOtp,
        handleVerifyOtp,
        handleRegister,
        handleGuest,
        handleResendOtp,
        clearError,
        goBack,
        goToEnterPhone,
    } = useAuth();

    return (
        <main className="min-h-dvh bg-white">
            {step === "welcome" && (
                <WelcomeScreen
                    isLoading={isLoading}
                    onPhone={() => {
                        clearError();
                        goToEnterPhone();
                    }}
                    onGuest={handleGuest}
                    onApple={() => { }}
                    onGoogle={() => { }}
                />
            )}

            {step === "enter-phone" && (
                <EnterPhoneScreen
                    isLoading={isLoading}
                    onBack={goBack}
                    onContinue={handleSendOtp}
                />
            )}

            {step === "otp" && (
                <OtpScreen
                    phone={phone}
                    cooldownSeconds={cooldownSeconds}
                    isLoading={isLoading}
                    error={error}
                    onBack={goBack}
                    clearError={clearError}
                    onVerify={handleVerifyOtp}
                    onResend={handleResendOtp}
                />
            )}

            {step === "create" && (
                <CreateAccountScreen
                    phone={phone}
                    isLoading={isLoading}
                    error={error}
                    onBack={goBack}
                    onCreate={handleRegister}
                />
            )}
        </main>
    );
}

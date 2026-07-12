"use client";

import { LogIn } from "lucide-react";
import { CheckoutBottomSheet } from "@/features/checkout/components/shared/CheckoutBottomSheet";
import { PrimaryButton } from "@/features/profile/components/shared/PrimaryButton";
import { useLanguage } from "@/features/language/useLanguage";

interface LoginRequiredSheetProps {
    isOpen: boolean;
    isVisible: boolean;
    onClose: () => void;
    loginHref?: string;
    onLogin?: () => void;
}

export function LoginRequiredSheet({
    isOpen,
    isVisible,
    onClose,
    loginHref = "/auth",
    onLogin,
}: LoginRequiredSheetProps) {
    const { isArabic } = useLanguage();

    return (
        <CheckoutBottomSheet
            isOpen={isOpen}
            isVisible={isVisible}
            onClose={onClose}
            ariaLabel={
                isArabic
                    ? "هذه الخدمة تتطلب تسجيل دخول"
                    : "This service requires signing in"
            }
            showCloseButton
        >
            <div className="mx-auto flex w-full max-w-md flex-col items-center px-2 pb-8 pt-4 text-center sm:px-4">
                <div className="relative mb-5 flex h-24 w-24 items-center justify-center sm:h-28 sm:w-28">
                    <div className="absolute inset-0 rounded-full bg-[#EBFEEB] dark:bg-[#30913F]/15" />
                    <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-b from-[#8CC63F] to-[#39B54A] text-white shadow-lg sm:h-[72px] sm:w-[72px]">
                        <LogIn className="h-7 w-7 text-white sm:h-8 sm:w-8" strokeWidth={2.2} aria-hidden />
                    </div>
                </div>
                <h2 className="mb-2 text-[17px] font-bold text-gray-900 dark:text-gray-50 sm:text-lg">
                    {isArabic
                        ? "هذه الخدمة تتطلب تسجيل دخول"
                        : "This service requires signing in"}
                </h2>
                <p className="mb-6 text-[14px] leading-relaxed text-gray-500 dark:text-gray-400 sm:text-[15px]">
                    {isArabic
                        ? "الرجاء تسجيل الدخول للاستمتاع بخدمتك"
                        : "Please sign in to use this service"}
                </p>
                <PrimaryButton href={onLogin ? undefined : loginHref} onClick={onLogin}>
                    {isArabic ? "تسجيل الدخول" : "Sign in"}
                </PrimaryButton>
            </div>
        </CheckoutBottomSheet>
    );
}

"use client";

import { LogIn } from "lucide-react";
import { CheckoutBottomSheet } from "@/features/checkout/components/shared/CheckoutBottomSheet";
import { PROFILE_STRINGS } from "@/features/profile/constants/profile.strings";
import { PrimaryButton } from "@/features/profile/components/shared/PrimaryButton";

interface LoginRequiredSheetProps {
    isOpen: boolean;
    isVisible: boolean;
    onClose: () => void;
    onLogin: () => void;
}

export function LoginRequiredSheet({
    isOpen,
    isVisible,
    onClose,
    onLogin,
}: LoginRequiredSheetProps) {
    return (
        <CheckoutBottomSheet
            isOpen={isOpen}
            isVisible={isVisible}
            onClose={onClose}
            ariaLabel={PROFILE_STRINGS.loginRequiredTitle}
            showCloseButton
        >
            <div className="flex flex-col items-center px-2 pb-2 pt-4 text-center">
                <div className="relative mb-5 flex h-24 w-24 items-center justify-center">
                    <div className="absolute inset-0 rounded-full bg-[#EBFEEB]" />
                    <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-b from-[#8CC63F] to-[#39B54A] text-white shadow-lg">
                        <LogIn className="h-7 w-7 text-white" strokeWidth={2.2} />
                    </div>
                </div>
                <h2 className="mb-2 text-[17px] font-bold text-gray-900">
                    {PROFILE_STRINGS.loginRequiredTitle}
                </h2>
                <p className="mb-6 text-[14px] leading-relaxed text-gray-500">
                    {PROFILE_STRINGS.loginRequiredSubtitle}
                </p>
                <PrimaryButton onClick={onLogin}>{PROFILE_STRINGS.login}</PrimaryButton>
            </div>
        </CheckoutBottomSheet>
    );
}

"use client";

import { CheckoutBottomSheet } from "@/features/checkout/components/shared/CheckoutBottomSheet";
import { PROFILE_STRINGS } from "@/features/profile/constants/profile.strings";
import { PrimaryButton } from "@/features/profile/components/shared/PrimaryButton";

interface LogoutConfirmSheetProps {
    isOpen: boolean;
    isVisible: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isLoading?: boolean;
    isArabic?: boolean;
}

export function LogoutConfirmSheet({
    isOpen,
    isVisible,
    onClose,
    onConfirm,
    isLoading = false,
    isArabic = true,
}: LogoutConfirmSheetProps) {
    return (
        <CheckoutBottomSheet
            isOpen={isOpen}
            isVisible={isVisible}
            onClose={onClose}
            ariaLabel={
                isArabic
                    ? PROFILE_STRINGS.logoutConfirmTitle.ar
                    : PROFILE_STRINGS.logoutConfirmTitle.en
            }
        >
            <div className="mx-auto w-full max-w-md px-2 pb-8 pt-2 sm:px-4">
                <h2 className="mb-6 text-center text-[17px] font-bold text-gray-900 dark:text-gray-50 sm:text-lg">
                    {isArabic
                        ? PROFILE_STRINGS.logoutConfirmTitle.ar
                        : PROFILE_STRINGS.logoutConfirmTitle.en}
                </h2>
                <div className="flex flex-col gap-3">
                    <PrimaryButton onClick={onConfirm} disabled={isLoading}>
                        {isArabic
                            ? PROFILE_STRINGS.logoutConfirmYes.ar
                            : PROFILE_STRINGS.logoutConfirmYes.en}
                    </PrimaryButton>
                    <PrimaryButton
                        variant="danger-muted"
                        className="bg-gray-200 text-gray-900 dark:bg-gray-800 dark:text-gray-100"
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        {isArabic ? PROFILE_STRINGS.cancel.ar : PROFILE_STRINGS.cancel.en}
                    </PrimaryButton>
                </div>
            </div>
        </CheckoutBottomSheet>
    );
}

"use client";

import { CheckoutBottomSheet } from "@/features/checkout/components/shared/CheckoutBottomSheet";
import { PrimaryButton } from "@/features/profile/components/shared/PrimaryButton";
import { useLanguage } from "@/features/language/useLanguage";

interface LogoutConfirmSheetProps {
    isOpen: boolean;
    isVisible: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isLoading?: boolean;
}

export function LogoutConfirmSheet({
    isOpen,
    isVisible,
    onClose,
    onConfirm,
    isLoading = false,
}: LogoutConfirmSheetProps) {
    const { isArabic } = useLanguage();

    return (
        <CheckoutBottomSheet
            isOpen={isOpen}
            isVisible={isVisible}
            onClose={onClose}
            ariaLabel={
                isArabic
                    ? "هل أنت متأكد أنك تريد تسجيل الخروج ؟"
                    : "Are you sure you want to log out?"
            }
        >
            <div className="mx-auto w-full max-w-md px-2 pb-8 pt-2 sm:px-4">
                <h2 className="mb-6 text-center text-[17px] font-bold text-gray-900 dark:text-gray-50 sm:text-lg">
                    {isArabic
                        ? "هل أنت متأكد أنك تريد تسجيل الخروج ؟"
                        : "Are you sure you want to log out?"}
                </h2>
                <div className="flex flex-col gap-3">
                    <PrimaryButton onClick={onConfirm} disabled={isLoading}>
                        {isArabic ? "نعم ، تسجيل خروج" : "Yes, log out"}
                    </PrimaryButton>
                    <PrimaryButton
                        className="bg-gray-200 text-gray-900 dark:bg-gray-800 dark:text-gray-100"
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        {isArabic ? "إلغاء" : "Cancel"}
                    </PrimaryButton>
                </div>
            </div>
        </CheckoutBottomSheet>
    );
}

"use client";

import { useRouter } from "next/navigation";

import { CheckoutBottomSheet } from "@/features/checkout/components/shared/CheckoutBottomSheet";
import { PrimaryButton } from "@/features/profile/components/shared/PrimaryButton";
import { useLanguage } from "@/features/language/useLanguage";

interface QidhaSubscribeSheetProps {
    isOpen: boolean;
    isVisible: boolean;
    onClose: () => void;
}

export function QidhaSubscribeSheet({ isOpen, isVisible, onClose }: QidhaSubscribeSheetProps) {
    const { isArabic } = useLanguage();
    const router = useRouter();

    const handleSubscribe = () => {
        onClose();
        router.push("/profile/wallet-subscription");
    };

    return (
        <CheckoutBottomSheet
            isOpen={isOpen}
            isVisible={isVisible}
            onClose={onClose}
            ariaLabel={
                isArabic
                    ? "الاشتراك في قيدها المطلوب"
                    : "Qidha subscription required"
            }
        >
            <div className="mx-auto w-full max-w-md px-2 pb-4 pt-2 text-center sm:px-4">
                <h3 className="mb-3 text-[17px] font-bold text-gray-900 dark:text-gray-50 sm:text-lg">
                    {isArabic
                        ? "الاشتراك في قيدها المطلوب"
                        : "Qidha subscription required"}
                </h3>
                <p className="mb-6 text-[14px] leading-relaxed text-gray-600 dark:text-gray-300 sm:text-[15px]">
                    {isArabic
                        ? "لاستخدام محفظة قيدها ، يجب الاشتراك وتفعيل المحفظة أولاً"
                        : "To use the Qidha wallet, you must subscribe and activate it first"}
                </p>
                <PrimaryButton onClick={handleSubscribe}>
                    {isArabic ? "اشترك الآن" : "Subscribe now"}
                </PrimaryButton>
            </div>
        </CheckoutBottomSheet>
    );
}

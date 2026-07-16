"use client";

import { useRouter } from "next/navigation";

import { CheckoutBottomSheet } from "@/features/checkout/components/shared/CheckoutBottomSheet";
import { PrimaryButton } from "@/features/profile/components/shared/PrimaryButton";
import { PROFILE_STRINGS } from "@/features/profile/constants/profile.strings";

interface QidhaSubscribeSheetProps {
    isOpen: boolean;
    isVisible: boolean;
    onClose: () => void;
    isArabic?: boolean;
}

export function QidhaSubscribeSheet({
    isOpen,
    isVisible,
    onClose,
    isArabic = true,
}: QidhaSubscribeSheetProps) {
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
                    ? PROFILE_STRINGS.qidhaSubscribeTitle.ar
                    : PROFILE_STRINGS.qidhaSubscribeTitle.en
            }
        >
            <div className="mx-auto w-full max-w-md px-2 pb-8 pt-2 text-center sm:px-4">
                <h3 className="mb-3 text-[17px] font-bold text-gray-900 dark:text-gray-50 sm:text-lg">
                    {isArabic
                        ? PROFILE_STRINGS.qidhaSubscribeTitle.ar
                        : PROFILE_STRINGS.qidhaSubscribeTitle.en}
                </h3>
                <p className="mb-6 text-[14px] leading-relaxed text-gray-600 dark:text-gray-300 sm:text-[15px]">
                    {isArabic
                        ? PROFILE_STRINGS.qidhaSubscribeBody.ar
                        : PROFILE_STRINGS.qidhaSubscribeBody.en}
                </p>
                <PrimaryButton onClick={handleSubscribe}>
                    {isArabic
                        ? PROFILE_STRINGS.subscribeNow.ar
                        : PROFILE_STRINGS.subscribeNow.en}
                </PrimaryButton>
            </div>
        </CheckoutBottomSheet>
    );
}

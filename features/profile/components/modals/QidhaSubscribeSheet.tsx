"use client";

import { CheckoutBottomSheet } from "@/features/checkout/components/shared/CheckoutBottomSheet";
import { PROFILE_STRINGS } from "@/features/profile/constants/profile.strings";
import { PrimaryButton } from "@/features/profile/components/shared/PrimaryButton";

interface QidhaSubscribeSheetProps {
    isOpen: boolean;
    isVisible: boolean;
    onClose: () => void;
}

export function QidhaSubscribeSheet({ isOpen, isVisible, onClose }: QidhaSubscribeSheetProps) {
    return (
        <CheckoutBottomSheet
            isOpen={isOpen}
            isVisible={isVisible}
            onClose={onClose}
            ariaLabel={PROFILE_STRINGS.qidhaSubscribeTitle}
        >
            <div className="mx-auto w-full max-w-md px-2 pb-4 pt-2 text-center sm:px-4">
                <h3 className="mb-3 text-[17px] font-bold text-gray-900 dark:text-gray-50 sm:text-lg">
                    {PROFILE_STRINGS.qidhaSubscribeTitle}
                </h3>
                <p className="mb-6 text-[14px] leading-relaxed text-gray-600 dark:text-gray-300 sm:text-[15px]">
                    {PROFILE_STRINGS.qidhaSubscribeBody}
                </p>
                <PrimaryButton onClick={onClose}>{PROFILE_STRINGS.subscribeNow}</PrimaryButton>
            </div>
        </CheckoutBottomSheet>
    );
}

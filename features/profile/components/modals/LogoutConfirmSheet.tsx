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
}

export function LogoutConfirmSheet({
    isOpen,
    isVisible,
    onClose,
    onConfirm,
    isLoading = false,
}: LogoutConfirmSheetProps) {
    return (
        <CheckoutBottomSheet
            isOpen={isOpen}
            isVisible={isVisible}
            onClose={onClose}
            ariaLabel={PROFILE_STRINGS.logoutConfirmTitle}
        >
            <div className="px-2 pb-4 pt-2">
                <h2 className="mb-6 text-center text-[17px] font-bold text-gray-900">
                    {PROFILE_STRINGS.logoutConfirmTitle}
                </h2>
                <div className="flex flex-col gap-3">
                    <PrimaryButton onClick={onConfirm} disabled={isLoading}>
                        {PROFILE_STRINGS.logoutConfirmYes}
                    </PrimaryButton>
                    <PrimaryButton variant="danger-muted" onClick={onClose} disabled={isLoading}>
                        {PROFILE_STRINGS.cancel}
                    </PrimaryButton>
                </div>
            </div>
        </CheckoutBottomSheet>
    );
}

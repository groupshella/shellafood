"use client";

import { CheckoutBottomSheet } from "@/features/checkout/components/shared/CheckoutBottomSheet";
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
					? "هل أنت متأكد أنك تريد تسجيل الخروج ؟"
					: "Are you sure you want to log out?"
			}
			isArabic={isArabic}
		>
			<div className="mx-auto w-full max-w-md px-2 pb-8 pt-2 sm:max-w-lg sm:px-4 md:max-w-xl md:px-6 lg:max-w-2xl">
				<h2 className="mb-6 text-center text-[17px] font-bold text-foreground sm:text-lg md:text-xl">
					{isArabic
						? "هل أنت متأكد أنك تريد تسجيل الخروج ؟"
						: "Are you sure you want to log out?"}
				</h2>
				<div className="flex flex-col gap-3 sm:gap-3.5 md:gap-4">
					<PrimaryButton onClick={onConfirm} disabled={isLoading}>
						{isArabic ? "نعم ، تسجيل خروج" : "Yes, log out"}
					</PrimaryButton>
					<PrimaryButton
						variant="danger-muted"
						className="bg-card text-foreground"
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

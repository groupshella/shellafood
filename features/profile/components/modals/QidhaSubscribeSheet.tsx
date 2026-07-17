"use client";

import { useRouter } from "next/navigation";

import { CheckoutBottomSheet } from "@/features/checkout/components/shared/CheckoutBottomSheet";
import { PrimaryButton } from "@/features/profile/components/shared/PrimaryButton";

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
				isArabic ? "الاشتراك في قيدها المطلوب" : "Qidha subscription required"
			}
			isArabic={isArabic}
		>
			<div className="mx-auto w-full max-w-md px-2 pb-8 pt-2 text-center sm:max-w-lg sm:px-4 md:max-w-xl md:px-6 lg:max-w-2xl">
				<h3 className="mb-3 text-[17px] font-bold text-foreground sm:text-lg md:text-xl">
					{isArabic
						? "الاشتراك في قيدها المطلوب"
						: "Qidha subscription required"}
				</h3>
				<p className="mb-6 text-[14px] leading-relaxed text-muted sm:text-[15px] md:text-base">
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

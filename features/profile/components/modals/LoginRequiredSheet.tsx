"use client";

import { LogIn } from "lucide-react";
import { CheckoutBottomSheet } from "@/features/checkout/components/shared/CheckoutBottomSheet";
import { PrimaryButton } from "@/features/profile/components/shared/PrimaryButton";

interface LoginRequiredSheetProps {
	isOpen: boolean;
	isVisible: boolean;
	onClose: () => void;
	loginHref?: string;
	onLogin?: () => void;
	isArabic?: boolean;
}

export function LoginRequiredSheet({
	isOpen,
	isVisible,
	onClose,
	loginHref = "/auth",
	onLogin,
	isArabic = true,
}: LoginRequiredSheetProps) {
	return (
		<CheckoutBottomSheet
			isOpen={isOpen}
			isVisible={isVisible}
			onClose={onClose}
			ariaLabel={
				isArabic
					? "هذه الخدمة تتطلب تسجيل دخول"
					: "This service requires sign-in"
			}
			showCloseButton
			isArabic={isArabic}
		>
			<div className="mx-auto flex w-full max-w-md flex-col items-center px-2 pb-8 pt-4 text-center sm:max-w-lg sm:px-4 md:max-w-xl md:px-6 lg:max-w-2xl">
				<div className="relative mb-5 flex h-24 w-24 items-center justify-center sm:h-28 sm:w-28 md:h-32 md:w-32">
					<div className="absolute inset-0 rounded-full bg-brand/10" />
					<div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-b from-[#8CC63F] to-[#39B54A] text-brand-foreground shadow-lg sm:h-[72px] sm:w-[72px] md:h-20 md:w-20">
						<LogIn
							className="h-7 w-7 text-brand-foreground sm:h-8 sm:w-8 md:h-9 md:w-9"
							strokeWidth={2.2}
							aria-hidden
						/>
					</div>
				</div>
				<h2 className="mb-2 text-[17px] font-bold text-foreground sm:text-lg md:text-xl">
					{isArabic
						? "هذه الخدمة تتطلب تسجيل دخول"
						: "This service requires sign-in"}
				</h2>
				<p className="mb-6 text-[14px] leading-relaxed text-muted sm:text-[15px] md:text-base">
					{isArabic
						? "الرجاء تسجيل الدخول للاستمتاع بخدمتك"
						: "Please sign in to continue"}
				</p>
				<PrimaryButton href={onLogin ? undefined : loginHref} onClick={onLogin}>
					{isArabic ? "تسجيل الدخول" : "Sign in"}
				</PrimaryButton>
			</div>
		</CheckoutBottomSheet>
	);
}

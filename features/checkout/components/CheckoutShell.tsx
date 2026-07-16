"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { CheckoutProvider, useCheckout } from "@/features/checkout/context/CheckoutContext";
import type { CheckoutData } from "@/features/checkout/types/checkout.types";

interface CheckoutShellProps {
	children: React.ReactNode;
	checkoutData: CheckoutData;
	isArabic: boolean;
}

interface CheckoutShellInnerProps {
	children: React.ReactNode;
	isArabic: boolean;
}

const SHELL_LAYOUT =
	"relative mx-auto min-h-dvh w-full max-w-lg overflow-x-hidden bg-background sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl";

const HEADER_PADDING = "px-3 py-3 sm:px-4 sm:py-3.5 md:px-5 lg:px-6";
const CONTENT_PADDING =
	"px-3 py-4 pb-36 sm:px-4 sm:py-5 sm:pb-40 md:px-5 lg:px-6 lg:pb-44";
const FOOTER_PADDING =
	"px-3 pt-3 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-4 sm:pt-4 md:px-5 lg:px-6";

const CONFIRM_BUTTON_LABELS: Record<string, { ar: string; en: string }> = {
	"my-wallet": { ar: "ادفع من محفظتي", en: "Pay from my wallet" },
	"qidha-wallet": { ar: "ادفع من محفظة قيدها", en: "Pay from Qidha wallet" },
	electronic: { ar: "انتقل للدفع الإلكتروني", en: "Continue to electronic payment" },
};

function CheckoutShellInner({ children, isArabic }: CheckoutShellInnerProps) {
	const { confirmPayment, isPlacingOrder, orderError, selected, canPlaceOrder, invoice } =
		useCheckout();

	const isDisabled = isPlacingOrder || !canPlaceOrder;

	const confirmLabel = selected
		? (CONFIRM_BUTTON_LABELS[selected]
			? isArabic
				? CONFIRM_BUTTON_LABELS[selected].ar
				: CONFIRM_BUTTON_LABELS[selected].en
			: isArabic
				? "تأكيد الدفع"
				: "Confirm payment")
		: isArabic
			? "تأكيد الدفع"
			: "Confirm payment";

	const buttonLabel = isPlacingOrder
		? isArabic
			? "جاري تأكيد الطلب..."
			: "Confirming order..."
		: !canPlaceOrder
			? isArabic
				? `الحد الأدنى للطلب ${invoice.minimumOrder}`
				: `Minimum order ${invoice.minimumOrder}`
			: confirmLabel;

	return (
		<div
			className={SHELL_LAYOUT}
			dir={isArabic ? "rtl" : "ltr"}
			lang={isArabic ? "ar" : "en"}
		>
			<header
				className={`sticky top-0 z-10 flex items-center justify-between bg-background shadow-[0_1px_0_0_rgba(0,0,0,0.06)] ${HEADER_PADDING}`}
			>
				<Link
					href="/cart"
					aria-label={isArabic ? "رجوع" : "Go back"}
					className="flex h-10 w-10 items-center justify-center rounded-full bg-card text-foreground transition-colors active:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:h-11 sm:w-11"
				>
					<ChevronRight
						className={["h-5 w-5 sm:h-[22px] sm:w-[22px]", isArabic ? "" : "rotate-180"].join(
							" ",
						)}
						aria-hidden
					/>
				</Link>

				<h1 className="text-base font-semibold text-foreground sm:text-lg lg:text-xl">
					{isArabic ? "الدفع" : "Checkout"}
				</h1>

				<div className="h-10 w-10 sm:h-11 sm:w-11" aria-hidden />
			</header>

			<main className={`space-y-3 sm:space-y-4 lg:space-y-5 ${CONTENT_PADDING}`}>
				<div className="mx-auto w-full max-w-3xl space-y-3 sm:space-y-4 lg:max-w-none lg:space-y-5">
					{children}
				</div>
			</main>

			<div className="fixed inset-x-0 bottom-0 z-10 bg-background shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
				<div
					className={`mx-auto w-full max-w-lg sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl ${FOOTER_PADDING}`}
				>
					{!canPlaceOrder && (
						<p className="mb-2 rounded-lg bg-amber-500/10 px-3 py-2 text-center text-xs font-medium text-amber-500 ring-1 ring-amber-500/20 sm:text-sm">
							{isArabic
								? `أضف منتجات بقيمة لا تقل عن ${invoice.minimumOrder} لإتمام الطلب`
								: `Add items worth at least ${invoice.minimumOrder} to complete your order`}
						</p>
					)}
					{orderError && (
						<p className="mb-2 rounded-lg bg-red-500/10 px-3 py-2 text-center text-xs font-medium text-red-500 ring-1 ring-red-500/20 sm:text-sm">
							{orderError}
						</p>
					)}
					<button
						type="button"
						onClick={confirmPayment}
						disabled={isDisabled}
						className="w-full rounded-2xl bg-brand py-3.5 text-sm font-semibold text-brand-foreground shadow-sm transition-colors active:brightness-95 disabled:cursor-not-allowed disabled:opacity-60 sm:py-4 sm:text-[15px] lg:ms-auto lg:block lg:max-w-md"
					>
						{buttonLabel}
					</button>
				</div>
			</div>
		</div>
	);
}

export function CheckoutShell({ children, checkoutData, isArabic }: CheckoutShellProps) {
	return (
		<CheckoutProvider data={checkoutData} isArabic={isArabic}>
			<CheckoutShellInner isArabic={isArabic}>{children}</CheckoutShellInner>
		</CheckoutProvider>
	);
}

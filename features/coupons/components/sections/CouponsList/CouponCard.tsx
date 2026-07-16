"use client";

import { memo } from "react";
import { Check, Copy } from "lucide-react";

import { formatExpireDate, isCouponExpiringSoon } from "@/features/coupons/lib/coupon-utils";
import type { AvailableCoupon, Coupon } from "@/features/coupons/types/coupon.types";

// Decorative ribbon palettes (illustration accents — not UI chrome tokens)
const RIBBON_STYLES = [
	{ stub: "bg-[#D1FDD2]", text: "text-brand", overlay: "bg-[#EBFEEB]/80" },
	{ stub: "bg-[#DFD3F5]", text: "text-[#7861A6]", overlay: "bg-white/25" },
	{ stub: "bg-[#FFDCDC]", text: "text-[#DB2626]", overlay: "bg-white/35" },
] as const;

type CouponCardProps = {
	coupon: Coupon | AvailableCoupon;
	index: number;
	variant: "available" | "expired";
	isCopied: boolean;
	onCopyCode: (code: string) => void;
	isArabic: boolean;
};

function discountValue(coupon: Coupon) {
	return coupon.discount_type === "percent" ? `${coupon.discount}%` : `${coupon.discount}`;
}

function StubDecoration({ overlayClass }: { overlayClass: string }) {
	return (
		<>
			<span
				className={`pointer-events-none absolute -left-[7px] top-[9px] h-[13px] w-14 -rotate-[21deg] ${overlayClass}`}
				aria-hidden
			/>
			<span
				className={`pointer-events-none absolute -left-[3px] top-[26px] h-[7px] w-14 -rotate-[21deg] ${overlayClass}`}
				aria-hidden
			/>
			<div
				className="pointer-events-none absolute -left-[7px] top-[27px] flex flex-col gap-1"
				aria-hidden
			>
				{Array.from({ length: 4 }, (_, i) => (
					<span key={i} className="h-[13px] w-[13px] rounded-full bg-background" />
				))}
			</div>
		</>
	);
}

export const CouponCard = memo(function CouponCard({
	coupon,
	index,
	variant,
	isCopied,
	onCopyCode,
	isArabic,
}: CouponCardProps) {
	const isUsable = "isUsable" in coupon ? coupon.isUsable : variant === "expired" ? false : !coupon.is_used;
	const expiringSoon = variant === "available" && isCouponExpiringSoon(coupon);
	const ribbon = RIBBON_STYLES[index % RIBBON_STYLES.length];
	const expiryText = formatExpireDate(coupon, isArabic);

	let statusLabel = isArabic ? "تفعيل" : "Activate";
	let statusClass = "font-bold text-brand";
	if (variant === "expired") {
		statusLabel = isArabic ? "منتهية الصلاحية" : "Expired";
		statusClass = "font-bold text-muted";
	} else if (expiringSoon) {
		statusLabel = isArabic ? "قارب على الانتهاء" : "Expiring soon";
		statusClass = "font-bold text-amber-500";
	} else if (!isUsable) {
		statusLabel = isArabic ? "مستخدم" : "Used";
		statusClass = "font-bold text-muted";
	}

	return (
		<div
			dir="ltr"
			className={[
				"relative flex h-full min-w-0 w-full overflow-hidden transition-opacity",
				variant === "expired" || !isUsable ? "opacity-55" : "",
			].join(" ")}
		>
			<div
				className={[
					"relative flex w-10 shrink-0 flex-col items-center justify-center rounded-l-2xl shadow-[0px_4px_16px_rgba(0,0,0,0.06)] sm:w-11 md:w-12",
					ribbon.stub,
				].join(" ")}
			>
				<StubDecoration overlayClass={ribbon.overlay} />
				<span
					className={`whitespace-nowrap text-sm font-bold leading-none [transform:rotate(-90deg)] sm:text-[15px] ${ribbon.text}`}
				>
					{isArabic ? "خصم" : "Off"}
				</span>
				<span
					className={`mt-1 whitespace-nowrap text-base font-black leading-none [transform:rotate(-90deg)] sm:text-lg ${ribbon.text}`}
				>
					{discountValue(coupon)}
				</span>
			</div>

			<div
				dir={isArabic ? "rtl" : "ltr"}
				lang={isArabic ? "ar" : "en"}
				className="relative flex min-w-0 flex-1 flex-col rounded-r-2xl border border-border border-s-0 bg-card shadow-[0px_4px_16px_rgba(0,0,0,0.06)]"
			>
				<div className="flex flex-col gap-1 px-3 pt-3 sm:gap-1.5 sm:px-4 sm:pt-3.5">
					<div className="flex items-center justify-between gap-2 sm:gap-3">
						<span className={`shrink-0 text-xs leading-snug sm:text-sm ${statusClass}`}>{statusLabel}</span>

						<button
							type="button"
							onClick={() => onCopyCode(coupon.code)}
							className="flex h-8 min-h-8 min-w-0 max-w-[45%] items-center justify-center gap-1.5 rounded-lg bg-background px-2 shadow-sm transition-colors active:brightness-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand sm:h-9 sm:max-w-[160px] sm:px-2.5"
							aria-label={
								isCopied
									? isArabic
										? `تم نسخ الكود ${coupon.code}`
										: `Copied code ${coupon.code}`
									: isArabic
										? `نسخ الكود ${coupon.code}`
										: `Copy code ${coupon.code}`
							}
						>
							{isCopied ? (
								<Check className="h-3.5 w-3.5 shrink-0 text-brand sm:h-4 sm:w-4" strokeWidth={2} aria-hidden />
							) : (
								<Copy className="h-3.5 w-3.5 shrink-0 text-muted sm:h-4 sm:w-4" strokeWidth={1.5} aria-hidden />
							)}
							<span className="truncate text-[11px] font-bold text-foreground sm:text-xs">
								{coupon.code}
							</span>
						</button>
					</div>

					<h3 className="line-clamp-2 text-start text-sm font-bold leading-snug text-foreground sm:text-[15px]">
						{coupon.title}
					</h3>
				</div>

				<div className="my-2 border-t border-dashed border-border sm:my-2.5" aria-hidden />

				<div className="relative flex-1 px-3 pb-3 sm:px-4 sm:pb-4">
					<p className="text-start text-[11px] font-medium leading-relaxed text-muted sm:text-xs">
						{isArabic
							? "استخدم هذا الكوبون عند الدفع للحصول على الخصم تلقائيًا."
							: "Use this coupon at checkout to apply the discount automatically."}
					</p>
					{expiryText && (
						<span className="mt-1 block text-start text-[10px] font-medium text-brand sm:text-[11px]">
							{expiryText}
						</span>
					)}
				</div>
			</div>
		</div>
	);
});

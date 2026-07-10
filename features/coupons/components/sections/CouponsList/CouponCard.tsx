"use client";

import { memo } from "react";
import { Check, Copy } from "lucide-react";

import { formatExpireDate, isCouponExpiringSoon } from "@/features/coupons/lib/coupon-utils";
import type { AvailableCoupon, Coupon } from "@/features/coupons/types/coupon.types";

const RIBBON_STYLES = [
	{ stub: "bg-[#D1FDD2] dark:bg-[#1a4d20]", text: "text-[#30913F] dark:text-[#4db860]", overlay: "bg-[#EBFEEB]/80 dark:bg-[#0d2e12]/80" },
	{ stub: "bg-[#DFD3F5] dark:bg-[#2d1d4d]", text: "text-[#7861A6] dark:text-[#a98fe6]", overlay: "bg-white/25 dark:bg-black/25" },
	{ stub: "bg-[#FFDCDC] dark:bg-[#4d1a1a]", text: "text-[#DB2626] dark:text-[#f87171]", overlay: "bg-white/35 dark:bg-black/25" },
] as const;

type CouponCardProps = {
	coupon: Coupon | AvailableCoupon;
	index: number;
	variant: "available" | "expired";
	isCopied: boolean;
	onCopyCode: (code: string) => void;
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
					<span key={i} className="h-[13px] w-[13px] rounded-full bg-white dark:bg-gray-900" />
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
}: CouponCardProps) {
	const isUsable = "isUsable" in coupon ? coupon.isUsable : variant === "expired" ? false : !coupon.is_used;
	const expiringSoon = variant === "available" && isCouponExpiringSoon(coupon);
	const ribbon = RIBBON_STYLES[index % RIBBON_STYLES.length];
	const expiryText = formatExpireDate(coupon);

	let statusLabel = "تفعيل";
	let statusClass = "font-bold text-[#30913F] dark:text-[#4db860]";
	if (variant === "expired") {
		statusLabel = "منتهية الصلاحية";
		statusClass = "font-bold text-gray-400 dark:text-gray-500";
	} else if (expiringSoon) {
		statusLabel = "قارب على الانتهاء";
		statusClass = "font-bold text-amber-500 dark:text-amber-400";
	} else if (!isUsable) {
		statusLabel = "مستخدم";
		statusClass = "font-bold text-gray-400 dark:text-gray-500";
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
					"relative flex w-10 shrink-0 flex-col items-center justify-center rounded-l-2xl shadow-[0px_4px_16px_rgba(0,0,0,0.06)] dark:shadow-[0px_4px_16px_rgba(0,0,0,0.3)] sm:w-11 md:w-12",
					ribbon.stub,
				].join(" ")}
			>
				<StubDecoration overlayClass={ribbon.overlay} />
				<span
					className={`whitespace-nowrap text-sm font-bold leading-none [transform:rotate(-90deg)] sm:text-[15px] ${ribbon.text}`}
				>
					خصم
				</span>
				<span
					className={`mt-1 whitespace-nowrap text-base font-black leading-none [transform:rotate(-90deg)] sm:text-lg ${ribbon.text}`}
				>
					{discountValue(coupon)}
				</span>
			</div>

			<div
				dir="rtl"
				className="relative flex min-w-0 flex-1 flex-col rounded-r-2xl border border-gray-100 border-s-0 bg-white shadow-[0px_4px_16px_rgba(0,0,0,0.06)] dark:border-gray-700 dark:bg-gray-800 dark:shadow-[0px_4px_16px_rgba(0,0,0,0.3)]"
			>
				<div className="flex flex-col gap-1 px-3 pt-3 sm:gap-1.5 sm:px-4 sm:pt-3.5">
					<div className="flex items-center justify-between gap-2 sm:gap-3">
						<span className={`shrink-0 text-xs leading-snug sm:text-sm ${statusClass}`}>{statusLabel}</span>

						<button
							type="button"
							onClick={() => onCopyCode(coupon.code)}
							className="flex h-8 min-h-8 min-w-0 max-w-[45%] items-center justify-center gap-1.5 rounded-lg bg-gray-100 px-2 shadow-sm transition-colors active:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] dark:bg-gray-700 dark:active:bg-gray-600 sm:h-9 sm:max-w-[160px] sm:px-2.5"
							aria-label={isCopied ? `تم نسخ الكود ${coupon.code}` : `نسخ الكود ${coupon.code}`}
						>
							{isCopied ? (
								<Check className="h-3.5 w-3.5 shrink-0 text-[#30913F] dark:text-[#4db860] sm:h-4 sm:w-4" strokeWidth={2} aria-hidden />
							) : (
								<Copy className="h-3.5 w-3.5 shrink-0 text-gray-600 dark:text-gray-400 sm:h-4 sm:w-4" strokeWidth={1.5} aria-hidden />
							)}
							<span className="truncate text-[11px] font-bold text-gray-900 dark:text-gray-100 sm:text-xs">
								{coupon.code}
							</span>
						</button>
					</div>

					<h3 className="line-clamp-2 text-start text-sm font-bold leading-snug text-gray-900 dark:text-gray-50 sm:text-[15px]">
						{coupon.title}
					</h3>
				</div>

				<div className="my-2 border-t border-dashed border-gray-200 dark:border-gray-700 sm:my-2.5" aria-hidden />

				<div className="relative flex-1 px-3 pb-3 sm:px-4 sm:pb-4">
					<p className="text-start text-[11px] font-medium leading-relaxed text-gray-600 dark:text-gray-400 sm:text-xs">
						استخدم هذا الكوبون عند الدفع للحصول على الخصم تلقائيًا.
					</p>
					{expiryText && (
						<span className="mt-1 block text-start text-[10px] font-medium text-[#30913F] dark:text-[#4db860] sm:text-[11px]">
							{expiryText}
						</span>
					)}
				</div>
			</div>
		</div>
	);
});

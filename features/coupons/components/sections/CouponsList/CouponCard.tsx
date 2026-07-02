import { Check, Copy } from "lucide-react";

import { formatExpireDate, isCouponExpiringSoon } from "@/features/coupons/lib/coupon-utils";
import type { AvailableCoupon, Coupon } from "@/features/coupons/types/coupon.types";

const RIBBON_STYLES = [
	{ stub: "bg-[#30913F]/10", text: "text-[#30913F]", chip: "bg-[#30913F]/10 text-[#30913F]", accent: "text-[#30913F]" },
	{ stub: "bg-[#7C6FE0]/10", text: "text-[#7C6FE0]", chip: "bg-[#7C6FE0]/10 text-[#7C6FE0]", accent: "text-[#7C6FE0]" },
	{ stub: "bg-[#E05C6B]/10", text: "text-[#E05C6B]", chip: "bg-[#E05C6B]/10 text-[#E05C6B]", accent: "text-[#E05C6B]" },
] as const;

const PERFORATION_COUNT = 7;

type CouponCardProps = {
	coupon: Coupon | AvailableCoupon;
	index: number;
	variant: "available" | "expired";
	isCopied: boolean;
	onCopyCode: (code: string) => void;
};

function discountLabel(coupon: Coupon) {
	return coupon.discount_type === "percent" ? `${coupon.discount}%` : `${coupon.discount} ر.س`;
}

function TicketPerforation({ side }: { side: "left" | "right" }) {
	return (
		<div
			className={`pointer-events-none absolute inset-y-0 flex w-3 flex-col justify-evenly py-2 ${
				side === "left" ? "-left-1.5" : "-right-1.5"
			}`}
			aria-hidden="true"
		>
			{Array.from({ length: PERFORATION_COUNT }, (_, i) => (
				<span key={i} className="mx-auto h-3 w-3 shrink-0 rounded-full bg-white" />
			))}
		</div>
	);
}

export function CouponCard({ coupon, index, variant, isCopied, onCopyCode }: CouponCardProps) {
	const isUsable = "isUsable" in coupon ? coupon.isUsable : variant === "expired" ? false : !coupon.is_used;
	const expiringSoon = variant === "available" && isCouponExpiringSoon(coupon);
	const ribbon = RIBBON_STYLES[index % RIBBON_STYLES.length];
	const expiryText = formatExpireDate(coupon);

	let statusLabel = "تفعيل";
	let statusClass = `font-bold ${ribbon.accent}`;
	if (variant === "expired") {
		statusLabel = "منتهية الصلاحية";
		statusClass = "font-bold text-gray-400";
	} else if (expiringSoon) {
		statusLabel = "قرب على الانتهاء";
		statusClass = "font-bold text-[#E05C6B]";
	} else if (!isUsable) {
		statusLabel = "مستخدم";
		statusClass = "font-bold text-gray-400";
	}

	return (
		<div
			dir="ltr"
			className={`relative flex overflow-hidden rounded-[20px] border border-gray-100 bg-white shadow-sm ${
				variant === "expired" || !isUsable ? "opacity-60" : ""
			}`}
		>
			{/* ticket stub */}
			<div
				className={`relative flex w-[72px] shrink-0 items-center justify-center sm:w-20 ${ribbon.stub}`}
				style={{
					backgroundImage:
						"repeating-linear-gradient(-45deg, transparent, transparent 5px, rgba(0,0,0,0.025) 5px, rgba(0,0,0,0.025) 10px)",
				}}
			>
				<TicketPerforation side="left" />
				<span
					className={`whitespace-nowrap text-sm font-extrabold [writing-mode:vertical-rl] ${ribbon.text}`}
					style={{ transform: "rotate(180deg)" }}
				>
					{discountLabel(coupon)} خصم
				</span>
				<div className="absolute inset-y-4 right-0 border-r border-dashed border-gray-300/80" aria-hidden="true" />
				<TicketPerforation side="right" />
			</div>

			{/* content */}
			<div dir="rtl" className="flex flex-1 flex-col gap-2.5 px-4 py-3.5 sm:px-5 sm:py-4">
				<div className="flex items-center justify-between gap-2">
					<span className={`text-sm ${statusClass}`}>{statusLabel}</span>
					<button
						type="button"
						onClick={() => onCopyCode(coupon.code)}
						className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors active:opacity-80 ${ribbon.chip}`}
						aria-label={`نسخ الكود ${coupon.code}`}
					>
						{isCopied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
						{coupon.code}
					</button>
				</div>

				<h3 className="text-sm font-extrabold leading-6 text-gray-900 sm:text-[15px]">{coupon.title}</h3>

				<div className="border-t border-dashed border-gray-200" aria-hidden="true" />

				<p className="text-xs leading-5 text-gray-500 sm:text-[13px]">
					استخدم هذا الكوبون عند الدفع للحصول على الخصم تلقائيًا.
				</p>

				{expiryText && <span className="text-[11px] text-gray-400 sm:text-xs">{expiryText}</span>}
			</div>
		</div>
	);
}

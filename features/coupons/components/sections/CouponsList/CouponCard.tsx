import { Check, Copy } from "lucide-react";

import { formatExpireDate, isCouponExpiringSoon } from "@/features/coupons/lib/coupon-utils";
import type { AvailableCoupon, Coupon } from "@/features/coupons/types/coupon.types";

const RIBBON_STYLES = [
	{ stub: "bg-[#D1FDD2]", text: "text-[#30913F]", overlay: "bg-[#EBFEEB]/80" },
	{ stub: "bg-[#DFD3F5]", text: "text-[#7861A6]", overlay: "bg-white/25" },
	{ stub: "bg-[#FFDCDC]", text: "text-[#DB2626]", overlay: "bg-white/35" },
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
					<span key={i} className="h-[13px] w-[13px] rounded-full bg-white" />
				))}
			</div>
		</>
	);
}

export function CouponCard({ coupon, index, variant, isCopied, onCopyCode }: CouponCardProps) {
	const isUsable = "isUsable" in coupon ? coupon.isUsable : variant === "expired" ? false : !coupon.is_used;
	const expiringSoon = variant === "available" && isCouponExpiringSoon(coupon);
	const ribbon = RIBBON_STYLES[index % RIBBON_STYLES.length];
	const expiryText = formatExpireDate(coupon);

	let statusLabel = "تفعيل";
	let statusClass = "font-bold text-[#30913F]";
	if (variant === "expired") {
		statusLabel = "منتهية الصلاحية";
		statusClass = "font-bold text-gray-400";
	} else if (expiringSoon) {
		statusLabel = "قرب على الانتهاء";
		statusClass = "font-bold text-[#30913F]";
	} else if (!isUsable) {
		statusLabel = "مستخدم";
		statusClass = "font-bold text-gray-400";
	}

	return (
		<div
			dir="ltr"
			className={`relative flex h-[125px] w-full overflow-hidden ${
				variant === "expired" || !isUsable ? "opacity-60" : ""
			}`}
		>
			<div
				className={`relative flex w-11 shrink-0 flex-col items-center justify-center rounded-l-2xl shadow-[0px_7px_19.8px_rgba(0,0,0,0.04)] ${ribbon.stub}`}
			>
				<StubDecoration overlayClass={ribbon.overlay} />
				<span className={`whitespace-nowrap text-[16px] font-bold leading-[160%] [transform:rotate(-90deg)] ${ribbon.text}`}>
					خصم
				</span>
				<span className={`whitespace-nowrap text-[20px] font-black leading-[160%] [transform:rotate(-90deg)] ${ribbon.text}`}>
					{discountValue(coupon)}
				</span>
			</div>

			<div
				dir="rtl"
				className="relative flex h-[125px] min-w-0 flex-1 flex-col rounded-r-2xl border border-[#F6F5F8] border-s-0 bg-white shadow-[0px_7px_19.8px_rgba(0,0,0,0.04)]"
			>
				<div className="flex flex-col gap-1 px-4 pt-2">
					<div className="flex items-start justify-between gap-4">
						<span className={`text-[16px] leading-[160%] ${statusClass}`}>{statusLabel}</span>
						<button
							type="button"
							onClick={() => onCopyCode(coupon.code)}
							className="flex h-[26px] min-w-[100px] items-center justify-center gap-2 rounded-lg bg-[#F6F5F8] px-2 shadow-[0px_7px_19.8px_rgba(0,0,0,0.04)] transition-colors active:opacity-80"
							aria-label={`نسخ الكود ${coupon.code}`}
						>
							{isCopied ? (
								<Check className="h-4 w-4 text-[#111B18]" strokeWidth={1.25} />
							) : (
								<Copy className="h-4 w-4 text-[#111B18]" strokeWidth={1.25} />
							)}
							<span className="text-[14px] font-bold leading-[160%] text-[#111B18]">{coupon.code}</span>
						</button>
					</div>

					<h3 className="text-end text-[16px] font-bold leading-[160%] text-[#111B18]">{coupon.title}</h3>
				</div>

				<div className="my-1 border-t border-dashed border-[#F6F5F8]" aria-hidden />

				<div className="relative flex-1 px-4 pb-2">
					<p className="text-end text-[14px] font-medium leading-[160%] text-[#111B18]">
						استخدم هذا الكوبون عند الدفع للحصول على الخصم تلقائيًا.
					</p>
					{expiryText && (
						<span className="absolute bottom-0 start-3 text-[12px] font-medium leading-[160%] text-[#30913F]">
							{expiryText}
						</span>
					)}
				</div>
			</div>
		</div>
	);
}

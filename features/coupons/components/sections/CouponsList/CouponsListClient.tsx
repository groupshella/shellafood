"use client";

import { useCallback, useState } from "react";

import { CouponCard } from "@/features/coupons/components/sections/CouponsList/CouponCard";
import { CouponsEmpty } from "@/features/coupons/components/sections/CouponsList/CouponsEmpty";
import type { AvailableCoupon, Coupon, CouponTab } from "@/features/coupons/types/coupon.types";

type CouponsListClientProps = {
	available: AvailableCoupon[];
	expired: Coupon[];
	isArabic: boolean;
};

const TABS: { id: CouponTab; label: { ar: string; en: string } }[] = [
	{ id: "available", label: { ar: "المتاحة", en: "Available" } },
	{ id: "expired", label: { ar: "منتهية الصلاحية", en: "Expired" } },
];

const CONTENT_PADDING = "px-3 pb-8 pt-4 sm:px-4 sm:pb-10 sm:pt-5 md:px-5 lg:px-6";
const COUPONS_GRID = "grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4 lg:gap-5";

export function CouponsListClient({
	available,
	expired,
	isArabic,
}: CouponsListClientProps) {
	const [activeTab, setActiveTab] = useState<CouponTab>("available");
	const [copiedCode, setCopiedCode] = useState<string | null>(null);

	const handleCopyCode = useCallback(async (code: string) => {
		try {
			await navigator.clipboard.writeText(code);
			setCopiedCode(code);
			window.setTimeout(() => setCopiedCode((current) => (current === code ? null : current)), 1500);
		} catch {
			// Clipboard API can fail silently (permissions, insecure context) — no-op.
		}
	}, []);

	const activeList = activeTab === "available" ? available : expired;

	return (
		<div
			dir={isArabic ? "rtl" : "ltr"}
			lang={isArabic ? "ar" : "en"}
			className={`flex flex-col gap-4 sm:gap-5 ${CONTENT_PADDING}`}
		>
			<div
				role="tablist"
				aria-label={isArabic ? "تصفية الكوبونات" : "Filter coupons"}
				className="flex gap-1.5 rounded-2xl bg-card p-1 sm:gap-2 sm:p-1.5 lg:max-w-xl"
			>
				{TABS.map((tab) => {
					const isActive = tab.id === activeTab;
					return (
						<button
							key={tab.id}
							type="button"
							role="tab"
							onClick={() => setActiveTab(tab.id)}
							aria-selected={isActive}
							className={[
								"min-h-10 flex-1 rounded-xl py-2.5 text-sm font-bold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:min-h-11 sm:text-[15px]",
								isActive
									? "bg-brand text-brand-foreground shadow-sm"
									: "text-muted",
							].join(" ")}
						>
							{isArabic ? tab.label.ar : tab.label.en}
						</button>
					);
				})}
			</div>

			{activeList.length === 0 ? (
				<CouponsEmpty
					fullPage={false}
					isArabic={isArabic}
					message={
						activeTab === "available"
							? isArabic
								? "لا يوجد كوبونات في الوقت الحالي"
								: "No coupons available right now"
							: isArabic
								? "لا يوجد كوبونات منتهية الصلاحية"
								: "No expired coupons"
					}
				/>
			) : (
				<div className={COUPONS_GRID}>
					{activeList.map((coupon, index) => (
						<CouponCard
							key={coupon.id}
							coupon={coupon}
							index={index}
							variant={activeTab}
							isCopied={copiedCode === coupon.code}
							onCopyCode={handleCopyCode}
							isArabic={isArabic}
						/>
					))}
				</div>
			)}
		</div>
	);
}

"use client";

import { useState } from "react";

import { CouponCard } from "@/features/coupons/components/sections/CouponsList/CouponCard";
import { CouponsEmpty } from "@/features/coupons/components/sections/CouponsList/CouponsEmpty";
import type { AvailableCoupon, Coupon, CouponTab } from "@/features/coupons/types/coupon.types";

type CouponsListClientProps = {
	available: AvailableCoupon[];
	expired: Coupon[];
};

const TABS: { id: CouponTab; label: string }[] = [
	{ id: "available", label: "المتاحة" },
	{ id: "expired", label: "منتهية الصلاحية" },
];

const CONTENT_PADDING = "px-3 pb-8 pt-4 sm:px-4 sm:pb-10 sm:pt-5 md:px-5 lg:px-6";
const COUPONS_GRID = "grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4 lg:gap-5";

export function CouponsListClient({ available, expired }: CouponsListClientProps) {
	const [activeTab, setActiveTab] = useState<CouponTab>("available");
	const [copiedCode, setCopiedCode] = useState<string | null>(null);

	async function handleCopyCode(code: string) {
		try {
			await navigator.clipboard.writeText(code);
			setCopiedCode(code);
			window.setTimeout(() => setCopiedCode((current) => (current === code ? null : current)), 1500);
		} catch {
			// Clipboard API can fail silently (permissions, insecure context) — no-op.
		}
	}

	const activeList = activeTab === "available" ? available : expired;

	return (
		<div dir="rtl" className={`flex flex-col gap-4 sm:gap-5 ${CONTENT_PADDING}`}>
			<div
				role="tablist"
				aria-label="تصفية الكوبونات"
				className="flex gap-1.5 rounded-2xl bg-gray-100 p-1 dark:bg-gray-800 sm:gap-2 sm:p-1.5 lg:max-w-xl"
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
								"min-h-10 flex-1 rounded-xl py-2.5 text-sm font-bold transition-all duration-200 sm:min-h-11 sm:text-[15px]",
								isActive
									? "bg-[#30913F] text-white shadow-sm"
									: "text-gray-500 dark:text-gray-400",
							].join(" ")}
						>
							{tab.label}
						</button>
					);
				})}
			</div>

			{activeList.length === 0 ? (
				<CouponsEmpty
					fullPage={false}
					message={
						activeTab === "available"
							? "لا يوجد كوبونات في الوقت الحالي"
							: "لا يوجد كوبونات منتهية الصلاحية"
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
						/>
					))}
				</div>
			)}
		</div>
	);
}

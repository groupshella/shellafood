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
		<div dir="rtl" className="flex flex-col gap-4 px-4 pb-8 sm:px-6">
			{/* tabs */}
			<div className="flex gap-2 rounded-full bg-gray-50 p-1">
				{TABS.map((tab) => {
					const isActive = tab.id === activeTab;
					return (
						<button
							key={tab.id}
							type="button"
							onClick={() => setActiveTab(tab.id)}
							className={`flex-1 rounded-full py-2.5 text-sm font-bold transition-colors ${
								isActive ? "bg-[#30913F] text-white shadow-sm" : "text-gray-500"
							}`}
							aria-pressed={isActive}
						>
							{tab.label}
						</button>
					);
				})}
			</div>

			{/* list */}
			{activeList.length === 0 ? (
				<CouponsEmpty
					message={
						activeTab === "available"
							? "لا يوجد كوبونات في الوقت الحالي"
							: "لا يوجد كوبونات منتهية الصلاحية"
					}
				/>
			) : (
				<div className="flex flex-col gap-3">
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

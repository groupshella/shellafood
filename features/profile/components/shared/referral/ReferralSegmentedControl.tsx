"use client";

import type { ReferralTab } from "@/features/profile/types/referral.types";

const TABS: { id: ReferralTab; label: { ar: string; en: string } }[] = [
	{ id: "link", label: { ar: "رابط الدعوة", en: "Invite link" } },
	{ id: "invited", label: { ar: "الأصدقاء المدعوين", en: "Invited friends" } },
];

interface ReferralSegmentedControlProps {
	active: ReferralTab;
	onChange: (tab: ReferralTab) => void;
	isArabic: boolean;
}

export function ReferralSegmentedControl({
	active,
	onChange,
	isArabic,
}: ReferralSegmentedControlProps) {
	return (
		<div
			role="tablist"
			aria-label={isArabic ? "دعوة الأصدقاء" : "Invite friends"}
			className="mx-auto flex min-h-[44px] w-full rounded-[12px] bg-card p-[2px] sm:max-w-md md:max-w-lg"
		>
			{TABS.map((tab) => {
				const isActive = tab.id === active;
				return (
					<button
						key={tab.id}
						type="button"
						role="tab"
						aria-selected={isActive}
						onClick={() => onChange(tab.id)}
						className={[
							"min-h-[40px] flex-1 rounded-[12px] px-3 text-[14px] font-bold leading-none transition-colors duration-200 sm:text-[15px]",
							isActive
								? "bg-brand text-brand-foreground shadow-[0px_3px_8px_rgba(255,243,245,0.12),0px_3px_1px_rgba(0,0,0,0.04)]"
								: "bg-transparent text-foreground",
						].join(" ")}
					>
						{isArabic ? tab.label.ar : tab.label.en}
					</button>
				);
			})}
		</div>
	);
}

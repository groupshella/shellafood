"use client";

import type { ReferralTab } from "@/features/profile/types/referral.types";
import { REFERRAL_STRINGS } from "@/features/profile/constants/referral.strings";

const TABS: { id: ReferralTab; label: string }[] = [
    { id: "link", label: REFERRAL_STRINGS.tabLink },
    { id: "invited", label: REFERRAL_STRINGS.tabInvited },
];

interface ReferralSegmentedControlProps {
    active: ReferralTab;
    onChange: (tab: ReferralTab) => void;
}

export function ReferralSegmentedControl({ active, onChange }: ReferralSegmentedControlProps) {
    return (
        <div
            role="tablist"
            aria-label={REFERRAL_STRINGS.pageTitle}
            className="mx-auto flex h-[44px] w-full max-w-[343px] rounded-[12px] bg-[#F6F5F8] p-[2px]"
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
                            "h-[40px] flex-1 rounded-[12px] text-[14px] font-bold leading-none transition-colors duration-200",
                            isActive
                                ? "bg-[#30913F] text-white shadow-[0px_3px_8px_rgba(255,243,245,0.12),0px_3px_1px_rgba(0,0,0,0.04)]"
                                : "bg-transparent text-[#082E0A]",
                        ].join(" ")}
                    >
                        {tab.label}
                    </button>
                );
            })}
        </div>
    );
}

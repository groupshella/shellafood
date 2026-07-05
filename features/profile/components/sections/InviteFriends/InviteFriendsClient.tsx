"use client";

import { CircleDollarSign, Star } from "lucide-react";
import { useState } from "react";
import { ProfileSubpageShell } from "@/features/profile/components/ProfileSubpageShell";
import { ReferralHowItWorksCard } from "@/features/profile/components/shared/referral/ReferralHowItWorksCard";
import { ReferralIllustration } from "@/features/profile/components/shared/referral/ReferralIllustration";
import { ReferralInvitedList } from "@/features/profile/components/shared/referral/ReferralInvitedList";
import { ReferralLinkBox } from "@/features/profile/components/shared/referral/ReferralLinkBox";
import { ReferralSegmentedControl } from "@/features/profile/components/shared/referral/ReferralSegmentedControl";
import { ReferralStatsCard } from "@/features/profile/components/shared/referral/ReferralStatsCard";
import { REFERRAL_STRINGS } from "@/features/profile/constants/referral.strings";
import { groupInviteEntriesByDate } from "@/features/profile/lib/groupInviteEntries";
import type { ReferralData, ReferralTab } from "@/features/profile/types/referral.types";

interface InviteFriendsClientProps {
    data: ReferralData;
}

export function InviteFriendsClient({ data }: InviteFriendsClientProps) {
    const [activeTab, setActiveTab] = useState<ReferralTab>("link");
    const inviteGroups = groupInviteEntriesByDate(data.entries);

    return (
        <ProfileSubpageShell
            title={REFERRAL_STRINGS.pageTitle}
            showHeaderBorder={false}
            relaxedHeader
        >
            <div className="mx-auto flex w-full max-w-[343px] flex-col gap-6 pt-6">
                <ReferralSegmentedControl active={activeTab} onChange={setActiveTab} />

                {activeTab === "link" ? (
                    <InviteLinkTab data={data} />
                ) : (
                    <InvitedFriendsTab stats={data.stats} groups={inviteGroups} />
                )}
            </div>
        </ProfileSubpageShell>
    );
}

function InviteLinkTab({ data }: { data: ReferralData }) {
    return (
        <div className="flex w-full flex-col gap-6">
            <ReferralIllustration />

            <h2 className="text-center text-[18px] font-bold leading-[160%] text-[#111B18]">
                {REFERRAL_STRINGS.inviteTitle}
            </h2>

            <div className="flex items-center justify-start gap-2">
                <Star className="h-6 w-6 shrink-0 text-[#111B18]" strokeWidth={1.5} />

                <p className="text-start text-[16px] font-medium leading-[150%] text-[#111B18]">
                    {REFERRAL_STRINGS.inviteDesc}
                </p>
            </div>

            <div className="flex items-center justify-start gap-2">
                <CircleDollarSign className="h-6 w-6 shrink-0 text-[#111B18]" strokeWidth={1.5} />
                <p className="text-[18px] font-medium leading-[160%] text-[#111B18]">
                    {REFERRAL_STRINGS.rewardRate}{" "}
                    <span className="text-[16px]">{REFERRAL_STRINGS.currencySymbol}</span>
                </p>
            </div>

            <ReferralLinkBox link={data.referralLink} />

            <ReferralHowItWorksCard />
        </div>
    );
}

function InvitedFriendsTab({
    stats,
    groups,
}: {
    stats: ReferralData["stats"];
    groups: ReturnType<typeof groupInviteEntriesByDate>;
}) {
    return (
        <div className="flex w-full flex-col gap-4">
            <ReferralStatsCard stats={stats} />
            <ReferralInvitedList groups={groups} />
        </div>
    );
}

"use client";

import { CircleDollarSign, Star } from "lucide-react";
import { useState } from "react";
import { ProfileSubpageShell } from "@/features/profile/components/ProfileSubpageShell";
import { ReferralHowItWorksCard } from "@/features/profile/components/shared/referral/ReferralHowItWorksCard";
import { ReferralIllustration } from "@/features/profile/components/shared/referral/ReferralIllustration";
import { ReferralInvitedEmpty } from "@/features/profile/components/shared/referral/ReferralInvitedEmpty";
import { ReferralInvitedList } from "@/features/profile/components/shared/referral/ReferralInvitedList";
import { ReferralLinkBox } from "@/features/profile/components/shared/referral/ReferralLinkBox";
import { ReferralSegmentedControl } from "@/features/profile/components/shared/referral/ReferralSegmentedControl";
import { ReferralStatsCard } from "@/features/profile/components/shared/referral/ReferralStatsCard";
import { useLanguage } from "@/features/language/useLanguage";
import type { InvitedFriendsData, ReferralTab } from "@/features/profile/types/referral.types";

interface InviteFriendsClientProps {
    referralLink: string;
    invitedFriends: InvitedFriendsData;
}

export function InviteFriendsClient({ referralLink, invitedFriends }: InviteFriendsClientProps) {
    const { isArabic } = useLanguage();
    const [activeTab, setActiveTab] = useState<ReferralTab>("link");
    const hasInvitedFriends = invitedFriends.groups.length > 0;

    return (
        <ProfileSubpageShell
            title={isArabic ? "دعوة الأصدقاء" : "Invite friends"}
            showHeaderBorder={false}
            relaxedHeader
        >
            <div className="mx-auto flex w-full max-w-lg flex-col gap-6 pt-4 sm:max-w-2xl sm:gap-7 sm:pt-6 lg:max-w-3xl">
                <ReferralSegmentedControl active={activeTab} onChange={setActiveTab} />

                {activeTab === "link" ? (
                    <InviteLinkTab referralLink={referralLink} />
                ) : (
                    <InvitedFriendsTab invitedFriends={invitedFriends} hasInvitedFriends={hasInvitedFriends} />
                )}
            </div>
        </ProfileSubpageShell>
    );
}

function InviteLinkTab({ referralLink }: { referralLink: string }) {
    const { isArabic } = useLanguage();

    return (
        <div className="flex w-full flex-col gap-6 md:grid md:grid-cols-[minmax(220px,0.85fr)_minmax(0,1fr)] md:items-center md:gap-8">
            <ReferralIllustration />

            <div className="flex flex-col gap-5 md:gap-6">
                <h2 className="text-center text-[18px] font-bold leading-[160%] text-[#111B18] dark:text-gray-100 sm:text-xl md:text-start">
                    {isArabic ? "ادعُ أصدقاءك والشركات" : "Invite friends and businesses"}
                </h2>

                <div className="flex items-start justify-start gap-2">
                    <Star className="mt-0.5 h-5 w-5 shrink-0 text-[#111B18] dark:text-gray-200 sm:h-6 sm:w-6" strokeWidth={1.5} />

                    <p className="text-start text-[15px] font-medium leading-[160%] text-[#111B18] dark:text-gray-200 sm:text-[16px]">
                        {isArabic ? "انسخ الرمز الخاص بك وشاركه مع أصدقائك والشركات" : "Copy your code and share it with friends and businesses"}
                    </p>
                </div>

                <div className="flex items-center justify-start gap-2">
                    <CircleDollarSign className="h-5 w-5 shrink-0 text-[#111B18] dark:text-gray-200 sm:h-6 sm:w-6" strokeWidth={1.5} />
                    <p className="text-[17px] font-medium leading-[160%] text-[#111B18] dark:text-gray-200 sm:text-[18px]">
                        {isArabic ? "1 الإحالة = 10.00" : "1 referral = 10.00"}{" "}
                        <span className="text-[15px] sm:text-[16px]">﷼</span>
                    </p>
                </div>

                <ReferralLinkBox link={referralLink} />
            </div>

            <div className="md:col-span-2">
                <ReferralHowItWorksCard />
            </div>
        </div>
    );
}

function InvitedFriendsTab({
    invitedFriends,
    hasInvitedFriends,
}: {
    invitedFriends: InvitedFriendsData;
    hasInvitedFriends: boolean;
}) {
    if (!hasInvitedFriends) {
        return <ReferralInvitedEmpty />;
    }

    return (
        <div className="flex w-full flex-col gap-4 sm:gap-5">
            <ReferralStatsCard stats={invitedFriends.summary} />
            <ReferralInvitedList groups={invitedFriends.groups} />
        </div>
    );
}

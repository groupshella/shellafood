"use client";

import { ProfileSubpageShell } from "@/features/profile/components/ProfileSubpageShell";
import { POINTS_STRINGS } from "@/features/profile/constants/points.strings";
import type { PointsHistoryGroup } from "@/features/profile/types/points.types";
import { PointsHistoryList } from "./PointsHistoryList";
import { PointsSummaryCard } from "./PointsSummaryCard";

const TAJAWAL = { fontFamily: "'Tajawal', sans-serif" } as const;

interface MyPointsClientProps {
    convertiblePoints: number;
    history?: PointsHistoryGroup[];
}

export function MyPointsClient({
    convertiblePoints,
    history = [],
}: MyPointsClientProps) {
    return (
        <ProfileSubpageShell
            title={POINTS_STRINGS.pageTitle}
            relaxedHeader
            showHeaderBorder={false}
            showFooterBorder={false}
            mainClassName="bg-white dark:bg-gray-950 pb-4"
            footer={
                <div className="pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3">
                    <button
                        type="button"
                        className="flex h-12 w-full items-center justify-center rounded-[12px] bg-[#30913F] text-[15px] font-bold text-white transition-opacity active:opacity-90 sm:h-[52px] sm:text-[16px]"
                        style={TAJAWAL}
                    >
                        {POINTS_STRINGS.convertToWallet}
                    </button>
                </div>
            }
        >
            <div className="mx-auto flex w-full max-w-[343px] flex-col gap-6 md:max-w-[720px]">
                <PointsSummaryCard points={convertiblePoints} />
                <PointsHistoryList groups={history} />
            </div>
        </ProfileSubpageShell>
    );
}

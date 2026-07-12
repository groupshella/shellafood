"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

import { useLanguage } from "@/features/language/useLanguage";
import { ProfileSubpageShell } from "@/features/profile/components/ProfileSubpageShell";
import type { PointsHistoryGroup } from "@/features/profile/types/points.types";
import { useNotification } from "@/shared/components/NotificationToast";
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
    const { isArabic } = useLanguage();
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const { success, error } = useNotification();

    function handleConvert() {
        if (convertiblePoints <= 0) return;
        startTransition(async () => {
            try {
                const res = await fetch("/api/profile/points/convert", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ points: convertiblePoints }),
                });
                const json = await res.json();
                if (!res.ok || !json.success) {
                    error(
                        json?.message ??
                            (isArabic
                                ? "فشل في تحويل النقاط"
                                : "Failed to convert points"),
                    );
                    return;
                }
                success(
                    isArabic
                        ? "تم تحويل النقاط إلى المحفظة بنجاح"
                        : "Points converted to wallet successfully",
                );
                router.refresh();
            } catch {
                error(
                    isArabic
                        ? "فشل في تحويل النقاط"
                        : "Failed to convert points",
                );
            }
        });
    }

    return (
        <ProfileSubpageShell
            title={isArabic ? "نقاطي" : "My points"}
            relaxedHeader
            showHeaderBorder={false}
            showFooterBorder={false}
            mainClassName="bg-white dark:bg-gray-950 pb-4"
            footer={
                <div className="pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3">
                    <button
                        type="button"
                        disabled={convertiblePoints <= 0 || isPending}
                        onClick={handleConvert}
                        className="flex h-12 w-full items-center justify-center rounded-[12px] bg-[#30913F] text-[15px] font-bold text-white transition-opacity enabled:active:opacity-90 disabled:opacity-50 sm:h-[52px] sm:text-[16px]"
                        style={TAJAWAL}
                    >
                        {isPending
                            ? isArabic
                                ? "جاري التحويل..."
                                : "Converting..."
                            : isArabic
                              ? "تحويل إلى محفظة المال"
                              : "Convert to wallet"}
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

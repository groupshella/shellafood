"use client";

import { useMemo, useState } from "react";

import { ProfileSubpageShell } from "@/features/profile/components/ProfileSubpageShell";
import {
    FREQUENCY_OPTIONS,
    TAJAWAL,
} from "@/features/profile/constants/statistics.constants";
import { useGeneralAnalytics } from "@/features/profile/hooks/useGeneralAnalytics";
import { useRecordedAnalytics } from "@/features/profile/hooks/useRecordedAnalytics";
import type {
    ChartPeriod,
    GeneralAnalyticsInitialData,
    ProductLayout,
    RecordedAnalyticsInitialData,
    StatisticsTab,
} from "@/features/profile/types/statistics.types";
import { GeneralTabContent } from "./GeneralTabContent";
import { RecordedTabContent } from "./RecordedTabContent";

interface StatisticsClientProps {
    initialAnalytics?: GeneralAnalyticsInitialData | null;
    initialRecorded?: RecordedAnalyticsInitialData | null;
}

export function StatisticsClient({
    initialAnalytics = null,
    initialRecorded = null,
}: StatisticsClientProps) {
    const [activeTab, setActiveTab] = useState<StatisticsTab>("general");
    const [chartPeriod, setChartPeriod] = useState<ChartPeriod>("week");
    const [chartDropdownOpen, setChartDropdownOpen] = useState(false);
    const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
    const [filterValue, setFilterValue] = useState<string>(FREQUENCY_OPTIONS[0]);
    const [layoutMode, setLayoutMode] = useState<ProductLayout>("grid");
    const [heartOverrides, setHeartOverrides] = useState<Record<number, boolean>>({});
    const [heartPulse, setHeartPulse] = useState<number | null>(null);
    const [contentVisible, setContentVisible] = useState(true);

    const analytics = useGeneralAnalytics({
        period: chartPeriod,
        initialData: initialAnalytics,
        enabled: true,
    });

    const recorded = useRecordedAnalytics({
        initialData: initialRecorded,
        enabled: true,
    });

    const hearts = useMemo(() => {
        const base: Record<number, boolean> = {};
        analytics.products?.forEach((p) => {
            base[p.id] = heartOverrides[p.id] ?? p.favorited ?? false;
        });
        return base;
    }, [analytics.products, heartOverrides]);

    const switchTab = (tab: StatisticsTab) => {
        if (tab === activeTab) return;
        setContentVisible(false);
        window.setTimeout(() => {
            setActiveTab(tab);
            setContentVisible(true);
        }, 200);
    };

    const toggleHeart = (productId: number) => {
        setHeartOverrides((c) => ({
            ...c,
            [productId]: !(hearts[productId] ?? false),
        }));
        setHeartPulse(productId);
        window.setTimeout(() => setHeartPulse(null), 300);
    };

    return (
        <ProfileSubpageShell
            title="إحصائيات"
            relaxedHeader
            showHeaderBorder={false}
            mainClassName="bg-[#F6F5F8] pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-3 dark:bg-gray-950 sm:pt-4 lg:pb-12 lg:pt-5"
        >
            <div className="mx-auto flex w-full max-w-lg flex-col gap-5 sm:max-w-2xl sm:gap-6 md:gap-7 lg:max-w-4xl xl:max-w-5xl">
                <div
                    role="tablist"
                    aria-label="إحصائيات"
                    className="mx-auto flex h-11 w-full max-w-md items-center rounded-xl bg-white p-0.5 shadow-[0px_1px_8px_rgba(0,0,0,0.04)] dark:bg-gray-900 sm:h-12 md:max-w-sm"
                >
                    <button
                        type="button"
                        role="tab"
                        aria-selected={activeTab === "general"}
                        onClick={() => switchTab("general")}
                        className={[
                            "flex h-full flex-1 items-center justify-center rounded-[10px] text-sm font-bold transition-[background-color,color] duration-200 sm:text-base",
                            activeTab === "general"
                                ? "bg-[#30913F] text-white shadow-[0px_3px_8px_rgba(48,145,63,0.25)]"
                                : "bg-transparent text-[#082E0A] dark:text-gray-300",
                        ].join(" ")}
                        style={TAJAWAL}
                    >
                        عام
                    </button>
                    <button
                        type="button"
                        role="tab"
                        aria-selected={activeTab === "recorded"}
                        onClick={() => switchTab("recorded")}
                        className={[
                            "flex h-full flex-1 items-center justify-center rounded-[10px] text-sm font-bold transition-[background-color,color] duration-200 sm:text-base",
                            activeTab === "recorded"
                                ? "bg-[#30913F] text-white shadow-[0px_3px_8px_rgba(48,145,63,0.25)]"
                                : "bg-transparent text-[#082E0A] dark:text-gray-300",
                        ].join(" ")}
                        style={TAJAWAL}
                    >
                        قيدها
                    </button>
                </div>

                <div
                    className={[
                        "transition-opacity duration-200",
                        contentVisible ? "opacity-100" : "opacity-0",
                    ].join(" ")}
                >
                    {activeTab === "general" ? (
                        <GeneralTabContent
                            analytics={analytics}
                            chartPeriod={chartPeriod}
                            chartDropdownOpen={chartDropdownOpen}
                            filterDropdownOpen={filterDropdownOpen}
                            filterValue={filterValue}
                            layoutMode={layoutMode}
                            hearts={hearts}
                            heartPulse={heartPulse}
                            onChartDropdownToggle={() => {
                                setChartDropdownOpen((o) => !o);
                                setFilterDropdownOpen(false);
                            }}
                            onChartDropdownClose={() => setChartDropdownOpen(false)}
                            onChartPeriodChange={setChartPeriod}
                            onFilterDropdownToggle={() => {
                                setFilterDropdownOpen((o) => !o);
                                setChartDropdownOpen(false);
                            }}
                            onFilterDropdownClose={() => setFilterDropdownOpen(false)}
                            onFilterChange={setFilterValue}
                            onLayoutToggle={() =>
                                setLayoutMode((m) => (m === "list" ? "grid" : "list"))
                            }
                            onToggleHeart={toggleHeart}
                        />
                    ) : (
                        <RecordedTabContent recorded={recorded} />
                    )}
                </div>
            </div>
        </ProfileSubpageShell>
    );
}

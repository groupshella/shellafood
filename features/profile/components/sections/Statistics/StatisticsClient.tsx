"use client";

import { useMemo, useState } from "react";

import { useLanguage } from "@/features/language/useLanguage";
import { ProfileSubpageShell } from "@/features/profile/components/ProfileSubpageShell";
import {
    MOCK_MONTHLY_TRENDS,
    MOCK_QIDHA_DATA,
    MOCK_STATISTICS_CATEGORIES,
    TAJAWAL,
} from "@/features/profile/constants/statistics.constants";
import { useGeneralAnalytics } from "@/features/profile/hooks/useGeneralAnalytics";
import type {
    ChartPeriod,
    GeneralAnalyticsInitialData,
    ProductLayout,
    QidhaStatisticsData,
    StatisticsCategory,
    StatisticsMonthTrend,
    StatisticsTab,
} from "@/features/profile/types/statistics.types";
import { GeneralTabContent } from "./GeneralTabContent";
import { RecordedTabContent } from "./RecordedTabContent";

interface StatisticsClientProps {
    initialAnalytics?: GeneralAnalyticsInitialData | null;
    /** قيدها tab — prop-driven until its own endpoint exists. */
    categories?: StatisticsCategory[];
    monthlyTrends?: StatisticsMonthTrend[];
    qidha?: QidhaStatisticsData;
}

export function StatisticsClient({
    initialAnalytics = null,
    categories = MOCK_STATISTICS_CATEGORIES,
    monthlyTrends = MOCK_MONTHLY_TRENDS,
    qidha = MOCK_QIDHA_DATA,
}: StatisticsClientProps) {
    const { isArabic } = useLanguage();
    const [activeTab, setActiveTab] = useState<StatisticsTab>("general");
    const [chartPeriod, setChartPeriod] = useState<ChartPeriod>("week");
    const [chartDropdownOpen, setChartDropdownOpen] = useState(false);
    const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
    const [filterValue, setFilterValue] = useState<string>("week");
    const [layoutMode, setLayoutMode] = useState<ProductLayout>("grid");
    const [heartOverrides, setHeartOverrides] = useState<Record<number, boolean>>({});
    const [heartPulse, setHeartPulse] = useState<number | null>(null);
    const [contentVisible, setContentVisible] = useState(true);

    const analytics = useGeneralAnalytics({
        period: chartPeriod,
        initialData: initialAnalytics,
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
            title={isArabic ? "إحصائيات" : "Statistics"}
            relaxedHeader
            showHeaderBorder={false}
            mainClassName="bg-[#F6F5F8] dark:bg-gray-800 pb-[max(2rem,env(safe-area-inset-bottom))] pt-4"
        >
            <div className="mx-auto flex w-full max-w-[343px] flex-col gap-6 md:max-w-[720px]">
                <div
                    role="tablist"
                    aria-label={isArabic ? "إحصائيات" : "Statistics"}
                    className="flex h-[44px] w-full items-center rounded-[12px] bg-white p-[2px] shadow-[0px_1px_8px_rgba(0,0,0,0.04)] dark:bg-gray-800 md:mx-auto md:max-w-[420px]"
                >
                    <button
                        type="button"
                        role="tab"
                        aria-selected={activeTab === "general"}
                        onClick={() => switchTab("general")}
                        className={[
                            "flex h-[40px] flex-1 items-center justify-center rounded-[10px] text-[14px] font-bold transition-[background-color,color] duration-200 sm:text-[16px]",
                            activeTab === "general"
                                ? "bg-[#30913F] text-white shadow-[0px_3px_8px_rgba(48,145,63,0.25)]"
                                : "bg-transparent text-[#082E0A] dark:text-gray-300",
                        ].join(" ")}
                        style={TAJAWAL}
                    >
                        {isArabic ? "عام" : "General"}
                    </button>
                    <button
                        type="button"
                        role="tab"
                        aria-selected={activeTab === "recorded"}
                        onClick={() => switchTab("recorded")}
                        className={[
                            "flex h-[40px] flex-1 items-center justify-center rounded-[10px] text-[14px] font-bold transition-[background-color,color] duration-200 sm:text-[16px]",
                            activeTab === "recorded"
                                ? "bg-[#30913F] text-white shadow-[0px_3px_8px_rgba(48,145,63,0.25)]"
                                : "bg-transparent text-[#082E0A] dark:text-gray-300",
                        ].join(" ")}
                        style={TAJAWAL}
                    >
                        {isArabic ? "قيدها" : "Qidha"}
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
                        <RecordedTabContent
                            qidha={qidha}
                            categories={categories}
                            monthlyTrends={monthlyTrends}
                        />
                    )}
                </div>
            </div>
        </ProfileSubpageShell>
    );
}

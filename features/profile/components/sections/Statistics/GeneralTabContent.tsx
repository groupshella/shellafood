"use client";

import { ChevronDown, ChevronUp, List } from "lucide-react";
import Image from "next/image";

import { TAJAWAL, CHART_PERIOD_OPTIONS, FREQUENCY_OPTIONS, MONTHS, WEEK_DAYS } from "@/features/profile/constants/statistics.constants";
import type { useGeneralAnalytics } from "@/features/profile/hooks/useGeneralAnalytics";
import type {
    ChartPeriod,
    ProductLayout,
} from "@/features/profile/types/statistics.types";
import { CategoryCard } from "./CategoryCard";
import { GridProductCard } from "./GridProductCard";
import { InsightCard } from "./InsightCard";
import { ListProductCard } from "./ListProductCard";
import { SpendingChart } from "./SpendingChart";
import { StatSpendingCard } from "./StatSpendingCard";
import { DropdownMenu } from "./shared/DropdownMenu";
import { EmptySectionCard } from "./shared/EmptySectionCard";
import { ErrorSectionCard } from "./shared/ErrorSectionCard";
import { SarIcon } from "./shared/SarIcon";
import { SectionTitle } from "./shared/SectionTitle";
import { SkeletonBlock } from "./shared/SkeletonBlock";

function LayoutToggleIcon({ mode }: { mode: ProductLayout }) {
    if (mode === "list") {
        return (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
                <rect x="4" y="4" width="7" height="7" rx="1" fill="#30913F" />
                <rect x="13" y="4" width="7" height="7" rx="1" fill="#30913F" />
                <rect x="4" y="13" width="16" height="7" rx="1" fill="#30913F" />
            </svg>
        );
    }
    return <List className="h-6 w-6 text-[#30913F]" strokeWidth={2} />;
}

export function GeneralTabContent({
    analytics,
    chartPeriod,
    chartDropdownOpen,
    filterDropdownOpen,
    filterValue,
    layoutMode,
    hearts,
    heartPulse,
    onChartDropdownToggle,
    onChartDropdownClose,
    onChartPeriodChange,
    onFilterDropdownToggle,
    onFilterDropdownClose,
    onFilterChange,
    onLayoutToggle,
    onToggleHeart,
}: {
    analytics: ReturnType<typeof useGeneralAnalytics>;
    chartPeriod: ChartPeriod;
    chartDropdownOpen: boolean;
    filterDropdownOpen: boolean;
    filterValue: string;
    layoutMode: ProductLayout;
    hearts: Record<number, boolean>;
    heartPulse: number | null;
    onChartDropdownToggle: () => void;
    onChartDropdownClose: () => void;
    onChartPeriodChange: (p: ChartPeriod) => void;
    onFilterDropdownToggle: () => void;
    onFilterDropdownClose: () => void;
    onFilterChange: (v: string) => void;
    onLayoutToggle: () => void;
    onToggleHeart: (id: number) => void;
}) {
    const {
        summary,
        trend,
        categories,
        products,
        insights,
        coreStatus,
        trendStatus,
        retryCore,
        retryTrend,
    } = analytics;

    const chartLabels = trend?.labels ?? (chartPeriod === "week" ? WEEK_DAYS : MONTHS);
    const chartValues = trend?.values ?? [];
    const hasTrendData = chartValues.some((v) => v > 0);

    return (
        <div className="flex flex-col gap-6">
            {coreStatus === "loading" && !summary ? (
                <div className="grid grid-cols-2 gap-2 md:gap-4">
                    <SkeletonBlock className="h-[93px]" />
                    <SkeletonBlock className="h-[93px]" />
                </div>
            ) : coreStatus === "error" && !summary ? (
                <ErrorSectionCard
                    message="تعذّر تحميل ملخص الإنفاق"
                    onRetry={retryCore}
                />
            ) : (
                <div className="grid grid-cols-2 gap-2 md:gap-4">
                    <StatSpendingCard
                        label="الإنفاق الأسبوعي"
                        amount={summary?.weeklyAmount ?? "00.00"}
                        changePercent={summary?.weeklyChangePercent ?? null}
                        hasData={summary?.hasData ?? false}
                    />
                    <StatSpendingCard
                        label="الإنفاق الشهري"
                        amount={summary?.monthlyAmount ?? "00.00"}
                        changePercent={summary?.monthlyChangePercent ?? null}
                        hasData={summary?.hasData ?? false}
                    />
                </div>
            )}

            <section className="flex flex-col gap-4">
                <div className="flex min-h-[33px] items-center justify-between gap-3">
                    <SectionTitle>الرسوم البيانية</SectionTitle>
                    <div className="relative shrink-0">
                        <button
                            type="button"
                            onClick={onChartDropdownToggle}
                            className="flex h-[33px] min-h-11 min-w-[86px] items-center justify-end gap-2 rounded-[4px] bg-[#F6F5F8] dark:bg-gray-800 px-2.5 py-2 sm:px-[10px]"
                        >
                            <ChevronDown
                                className="h-4 w-4 shrink-0 text-[#111B18] dark:text-gray-100"
                                strokeWidth={1.25}
                            />
                            <span
                                className="text-[14px] font-medium text-[#111B18] dark:text-gray-100"
                                style={TAJAWAL}
                            >
                                {CHART_PERIOD_OPTIONS.find((o) => o.id === chartPeriod)?.label}
                            </span>
                        </button>
                        <DropdownMenu
                            open={chartDropdownOpen}
                            items={CHART_PERIOD_OPTIONS.map((o) => o.label)}
                            selected={
                                CHART_PERIOD_OPTIONS.find((o) => o.id === chartPeriod)!.label
                            }
                            onSelect={(label) => {
                                const option = CHART_PERIOD_OPTIONS.find(
                                    (i) => i.label === label,
                                );
                                if (option) onChartPeriodChange(option.id);
                            }}
                            onClose={onChartDropdownClose}
                        />
                    </div>
                </div>

                {trendStatus === "error" && !trend ? (
                    <ErrorSectionCard
                        message="تعذّر تحميل الرسم البياني"
                        onRetry={retryTrend}
                    />
                ) : (
                    <div className="w-full rounded-[16px] border border-[#E8ECEF] dark:border-gray-700 bg-white dark:bg-gray-800 py-1.5 shadow-[0px_1.94334px_11.6601px_rgba(0,0,0,0.04)]">
                        <div className="flex items-start justify-between gap-3 px-3 pb-2 pt-2 sm:px-4">
                            <div className="min-w-0 flex flex-col items-start">
                                <p
                                    className="text-[16px] font-bold text-[#1F2937] dark:text-gray-100"
                                    style={TAJAWAL}
                                >
                                    تحليل الإنفاق
                                </p>
                                <p
                                    className="text-[12px] font-normal text-[#6B7280] dark:text-gray-400"
                                    style={TAJAWAL}
                                >
                                    يونيو 2026
                                </p>
                            </div>
                            <div className="flex shrink-0 flex-col items-center rounded-[9.72px] bg-[#E8F5E9] dark:bg-[#30913F]/15 px-2 py-1 sm:px-[9.72px] sm:py-[4.86px]">
                                <p
                                    className="text-center text-[10px] font-medium text-[#30913F] sm:text-[10.69px]"
                                    style={TAJAWAL}
                                >
                                    إجمالي الإنفاق
                                </p>
                                <div className="flex items-center gap-0.5 text-[#30913F]">
                                    <SarIcon width={13.72} height={15.36} />
                                    <span
                                        className="text-[14px] font-medium sm:text-[16px]"
                                        style={TAJAWAL}
                                    >
                                        {summary?.monthlyAmount ?? "00.00"}
                                    </span>
                                </div>
                            </div>
                        </div>
                        {trendStatus === "loading" && !trend ? (
                            <div className="px-4 pb-4">
                                <SkeletonBlock className="h-[140px] w-full" />
                            </div>
                        ) : (
                            <SpendingChart
                                labels={chartLabels}
                                values={
                                    chartValues.length
                                        ? chartValues
                                        : chartLabels.map(() => 0)
                                }
                                showLine={hasTrendData}
                                activeIndex={
                                    hasTrendData ? chartValues.length - 2 : 3
                                }
                            />
                        )}
                    </div>
                )}
            </section>

            <section className="flex flex-col gap-3">
                <SectionTitle>فئات الإنفاق</SectionTitle>
                {coreStatus === "loading" && !categories ? (
                    <div className="flex flex-col gap-3">
                        <SkeletonBlock className="h-[72px]" />
                        <SkeletonBlock className="h-[72px]" />
                    </div>
                ) : coreStatus === "error" && !categories ? (
                    <ErrorSectionCard
                        message="تعذّر تحميل فئات الإنفاق"
                        onRetry={retryCore}
                    />
                ) : categories && categories.length > 0 ? (
                    <div className="flex flex-col gap-3">
                        {categories.map((category) => (
                            <CategoryCard key={category.id} category={category} />
                        ))}
                    </div>
                ) : (
                    <EmptySectionCard>لا توجد فئات لعرضها حتى الأن</EmptySectionCard>
                )}
            </section>

            <section className="flex flex-col gap-4">
                <div className="flex min-h-[33px] items-center justify-between gap-3">
                    <SectionTitle>المنتجات الأكثر شراء</SectionTitle>
                    <div className="flex shrink-0 items-center gap-2">
                        <button
                            type="button"
                            aria-label="تبديل طريقة العرض"
                            onClick={onLayoutToggle}
                            className="flex h-10 w-10 items-center justify-center rounded-[4px] bg-[#EBFEEB] dark:bg-[#30913F]/15 p-1 sm:h-11 sm:w-11"
                        >
                            <LayoutToggleIcon mode={layoutMode} />
                        </button>
                        <div className="relative">
                            <button
                                type="button"
                                onClick={onFilterDropdownToggle}
                                className="flex h-[33px] min-h-11 min-w-[86px] items-center justify-end gap-2 rounded-[4px] bg-[#F6F5F8] dark:bg-gray-800 px-2.5 py-2 sm:px-[10px]"
                            >
                                {filterDropdownOpen ? (
                                    <ChevronUp
                                        className="h-4 w-4 shrink-0 text-[#111B18] dark:text-gray-100"
                                        strokeWidth={1.25}
                                    />
                                ) : (
                                    <ChevronDown
                                        className="h-4 w-4 shrink-0 text-[#111B18] dark:text-gray-100"
                                        strokeWidth={1.25}
                                    />
                                )}
                                <span
                                    className="text-[14px] font-medium text-[#111B18] dark:text-gray-100"
                                    style={TAJAWAL}
                                >
                                    {filterValue}
                                </span>
                            </button>
                            <DropdownMenu
                                open={filterDropdownOpen}
                                items={FREQUENCY_OPTIONS}
                                selected={filterValue}
                                onSelect={onFilterChange}
                                onClose={onFilterDropdownClose}
                                className="h-[96px]"
                            />
                        </div>
                    </div>
                </div>

                {coreStatus === "loading" && !products ? (
                    <div
                        className={
                            layoutMode === "grid"
                                ? "grid grid-cols-2 gap-2.5 sm:gap-3"
                                : "flex flex-col gap-3"
                        }
                    >
                        <SkeletonBlock
                            className={layoutMode === "grid" ? "h-[220px]" : "h-[90px]"}
                        />
                        <SkeletonBlock
                            className={layoutMode === "grid" ? "h-[220px]" : "h-[90px]"}
                        />
                    </div>
                ) : coreStatus === "error" && !products ? (
                    <ErrorSectionCard
                        message="تعذّر تحميل المنتجات الأكثر شراء"
                        onRetry={retryCore}
                    />
                ) : products && products.length > 0 ? (
                    layoutMode === "list" ? (
                        <div className="flex flex-col gap-3">
                            {products.map((product) => (
                                <ListProductCard
                                    key={product.id}
                                    product={product}
                                    favorited={hearts[product.id] ?? false}
                                    pulsing={heartPulse === product.id}
                                    onToggleHeart={() => onToggleHeart(product.id)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-3">
                            {products.map((product) => (
                                <GridProductCard
                                    key={product.id}
                                    product={product}
                                    favorited={hearts[product.id] ?? false}
                                    pulsing={heartPulse === product.id}
                                    onToggleHeart={() => onToggleHeart(product.id)}
                                />
                            ))}
                        </div>
                    )
                ) : (
                    <div className="mx-auto flex w-full max-w-[247px] flex-col items-center gap-6 py-4 animate-in fade-in duration-300">
                        <div className="relative aspect-[188/204] w-full max-w-[188px]">
                            <Image
                                src="/cart/emptyCart.png"
                                alt=""
                                fill
                                className="object-contain"
                                sizes="(max-width: 343px) 60vw, 188px"
                                priority
                            />
                        </div>
                        <p
                            className="text-center text-[16px] font-bold leading-[160%] text-[#111B18] dark:text-gray-100 sm:text-[18px]"
                            style={TAJAWAL}
                        >
                            لا توجد منتجات للعرض
                        </p>
                    </div>
                )}
            </section>

            <section className="flex flex-col gap-3">
                <SectionTitle>ملاحظات تحليلية</SectionTitle>
                {coreStatus === "loading" && !insights ? (
                    <SkeletonBlock className="h-[64px]" />
                ) : coreStatus === "error" && !insights ? (
                    <ErrorSectionCard
                        message="تعذّر تحميل الملاحظات التحليلية"
                        onRetry={retryCore}
                    />
                ) : insights && insights.length > 0 ? (
                    <div className="flex flex-col gap-2.5">
                        {insights.map((insight) => (
                            <InsightCard key={insight.id} insight={insight} />
                        ))}
                    </div>
                ) : (
                    <EmptySectionCard>لا توجد ملاحظات تحليلية حتى الأن</EmptySectionCard>
                )}
            </section>
        </div>
    );
}

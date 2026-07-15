"use client";

import { ChevronDown, ChevronUp, List } from "lucide-react";

import { EmptyCartIllustration } from "@/features/cart/components/sections/CartList/CartEmpty";
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

function ProductsEmptyInline() {
    return (
        <div
            className="mx-auto flex w-full max-w-xs flex-col items-center gap-4 py-6 sm:max-w-sm sm:gap-5 sm:py-8 md:py-10"
            dir="rtl"
        >
            <div
                className="relative aspect-[13/14] w-full max-w-[9.5rem] shrink-0 sm:max-w-[11rem] md:max-w-[12rem]
                    [--cart-bg:#EBFEEB] [--cart-bag:#9DFCA3] [--cart-line:#30913F] [--cart-wheel:#FFFFFF] [--cart-dot:#CFCFCF]
                    dark:[--cart-bg:#123320] dark:[--cart-bag:#1F5C33] dark:[--cart-line:#4ADE80] dark:[--cart-wheel:#111827] dark:[--cart-dot:#4B5563]"
            >
                <EmptyCartIllustration className="h-full w-full object-contain" aria-hidden />
            </div>
            <p
                className="text-center text-base font-bold leading-relaxed text-[#111B18] dark:text-gray-100 sm:text-lg"
                style={TAJAWAL}
            >
                لا توجد منتجات للعرض
            </p>
            <p
                className="max-w-[240px] text-center text-sm leading-relaxed text-gray-500 dark:text-gray-400 sm:max-w-xs sm:text-[15px]"
                style={TAJAWAL}
            >
                ابدأ بالتسوق لتظهر هنا منتجاتك الأكثر شراءً
            </p>
        </div>
    );
}

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
        <div className="flex flex-col gap-5 sm:gap-6 md:gap-7 lg:gap-8">
            {coreStatus === "loading" && !summary ? (
                <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                    <SkeletonBlock className="h-[93px] sm:h-24 md:h-28" />
                    <SkeletonBlock className="h-[93px] sm:h-24 md:h-28" />
                </div>
            ) : coreStatus === "error" && !summary ? (
                <ErrorSectionCard
                    message="تعذّر تحميل ملخص الإنفاق"
                    onRetry={retryCore}
                />
            ) : (
                <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
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

            <section className="flex flex-col gap-3 sm:gap-4">
                <div className="flex min-h-9 items-center justify-between gap-3 sm:min-h-11">
                    <SectionTitle>الرسوم البيانية</SectionTitle>
                    <div className="relative shrink-0">
                        <button
                            type="button"
                            onClick={onChartDropdownToggle}
                            className="flex h-9 min-h-11 min-w-[86px] items-center justify-end gap-2 rounded-md bg-[#F6F5F8] px-2.5 py-2 dark:bg-gray-800 sm:h-11 sm:px-3"
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
                    <div className="w-full rounded-2xl border border-[#E8ECEF] bg-white py-1.5 shadow-[0px_1.94334px_11.6601px_rgba(0,0,0,0.04)] dark:border-gray-700 dark:bg-gray-900 sm:rounded-[1.25rem]">
                        <div className="flex items-start justify-between gap-3 px-3 pb-2 pt-2 sm:px-4 md:px-5 md:pt-3">
                            <div className="flex min-w-0 flex-col items-start">
                                <p
                                    className="text-base font-bold text-[#1F2937] dark:text-gray-100 sm:text-lg"
                                    style={TAJAWAL}
                                >
                                    تحليل الإنفاق
                                </p>
                                <p
                                    className="text-xs font-normal text-[#6B7280] dark:text-gray-400 sm:text-sm"
                                    style={TAJAWAL}
                                >
                                    يونيو 2026
                                </p>
                            </div>
                            <div className="flex shrink-0 flex-col items-center rounded-lg bg-[#E8F5E9] px-2 py-1 dark:bg-[#30913F]/15 sm:px-2.5 sm:py-1.5">
                                <p
                                    className="text-center text-[10px] font-medium text-[#30913F] sm:text-xs"
                                    style={TAJAWAL}
                                >
                                    إجمالي الإنفاق
                                </p>
                                <div className="flex items-center gap-0.5 text-[#30913F]">
                                    <SarIcon width={13.72} height={15.36} />
                                    <span
                                        className="text-sm font-medium sm:text-base"
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

            <section className="flex flex-col gap-3 sm:gap-4">
                <SectionTitle>فئات الإنفاق</SectionTitle>
                {coreStatus === "loading" && !categories ? (
                    <div className="flex flex-col gap-3 sm:gap-3.5">
                        <SkeletonBlock className="h-[72px] sm:h-20" />
                        <SkeletonBlock className="h-[72px] sm:h-20" />
                    </div>
                ) : coreStatus === "error" && !categories ? (
                    <ErrorSectionCard
                        message="تعذّر تحميل فئات الإنفاق"
                        onRetry={retryCore}
                    />
                ) : categories && categories.length > 0 ? (
                    <div className="flex flex-col gap-3 sm:gap-3.5 md:grid md:grid-cols-2 md:gap-4">
                        {categories.map((category) => (
                            <CategoryCard key={category.id} category={category} />
                        ))}
                    </div>
                ) : (
                    <EmptySectionCard>لا توجد فئات لعرضها حتى الأن</EmptySectionCard>
                )}
            </section>

            <section className="flex flex-col gap-3 sm:gap-4">
                <div className="flex min-h-9 items-center justify-between gap-3 sm:min-h-11">
                    <SectionTitle>المنتجات الأكثر شراء</SectionTitle>
                    <div className="flex shrink-0 items-center gap-2">
                        <button
                            type="button"
                            aria-label="تبديل طريقة العرض"
                            onClick={onLayoutToggle}
                            className="flex h-10 w-10 items-center justify-center rounded-md bg-[#EBFEEB] p-1 dark:bg-[#30913F]/15 sm:h-11 sm:w-11"
                        >
                            <LayoutToggleIcon mode={layoutMode} />
                        </button>
                        <div className="relative">
                            <button
                                type="button"
                                onClick={onFilterDropdownToggle}
                                className="flex h-9 min-h-11 min-w-[86px] items-center justify-end gap-2 rounded-md bg-[#F6F5F8] px-2.5 py-2 dark:bg-gray-800 sm:h-11 sm:px-3"
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
                                ? "grid grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-3 lg:grid-cols-4 lg:gap-4"
                                : "flex flex-col gap-3 md:grid md:grid-cols-2 md:gap-4"
                        }
                    >
                        <SkeletonBlock
                            className={layoutMode === "grid" ? "h-[220px] sm:h-60" : "h-[90px] sm:h-24"}
                        />
                        <SkeletonBlock
                            className={layoutMode === "grid" ? "h-[220px] sm:h-60" : "h-[90px] sm:h-24"}
                        />
                    </div>
                ) : coreStatus === "error" && !products ? (
                    <ErrorSectionCard
                        message="تعذّر تحميل المنتجات الأكثر شراء"
                        onRetry={retryCore}
                    />
                ) : products && products.length > 0 ? (
                    layoutMode === "list" ? (
                        <div className="flex flex-col gap-3 md:grid md:grid-cols-2 md:gap-4">
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
                        <div className="grid grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-3 lg:grid-cols-4 lg:gap-4">
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
                    <ProductsEmptyInline />
                )}
            </section>

            <section className="flex flex-col gap-3 sm:gap-4">
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

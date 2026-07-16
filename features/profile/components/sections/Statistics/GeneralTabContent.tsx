"use client";

import { ChevronDown, ChevronUp, List } from "lucide-react";

import { EmptyCartIllustration } from "@/features/cart/components/sections/CartList/CartEmpty";
import {
	TAJAWAL,
	CHART_PERIOD_OPTIONS,
	FREQUENCY_OPTIONS,
	MONTHS,
	WEEK_DAYS,
	resolveLocaleLabels,
} from "@/features/profile/constants/statistics.constants";
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

function ProductsEmptyInline({ isArabic }: { isArabic: boolean }) {
	return (
		<div className="mx-auto flex w-full max-w-xs flex-col items-center gap-4 py-6 sm:max-w-sm sm:gap-5 sm:py-8 md:py-10">
			<div
				className="relative aspect-[13/14] w-full max-w-[9.5rem] shrink-0 sm:max-w-[11rem] md:max-w-[12rem]
                    [--cart-bg:#EBFEEB] [--cart-bag:#9DFCA3] [--cart-line:#30913F] [--cart-wheel:#FFFFFF] [--cart-dot:#CFCFCF]
                    dark:[--cart-bg:#123320] dark:[--cart-bag:#1F5C33] dark:[--cart-line:#4ADE80] dark:[--cart-wheel:#111827] dark:[--cart-dot:#4B5563]"
			>
				<EmptyCartIllustration
					className="h-full w-full object-contain"
					aria-hidden
				/>
			</div>
			<p
				className="text-center text-base font-bold leading-relaxed text-foreground sm:text-lg"
				style={TAJAWAL}
			>
				{isArabic ? "لا توجد منتجات للعرض" : "No products to show"}
			</p>
			<p
				className="max-w-[240px] text-center text-sm leading-relaxed text-muted sm:max-w-xs sm:text-[15px]"
				style={TAJAWAL}
			>
				{isArabic
					? "ابدأ بالتسوق لتظهر هنا منتجاتك الأكثر شراءً"
					: "Start shopping to see your most purchased products here"}
			</p>
		</div>
	);
}

function LayoutToggleIcon({ mode }: { mode: ProductLayout }) {
	if (mode === "list") {
		return (
			<svg
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				aria-hidden
				className="text-brand"
			>
				<rect x="4" y="4" width="7" height="7" rx="1" fill="currentColor" />
				<rect x="13" y="4" width="7" height="7" rx="1" fill="currentColor" />
				<rect x="4" y="13" width="16" height="7" rx="1" fill="currentColor" />
			</svg>
		);
	}
	return <List className="h-6 w-6 text-brand" strokeWidth={2} />;
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
	isArabic,
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
	isArabic: boolean;
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

	const lang = isArabic ? "ar" : "en";
	const periodLabels = resolveLocaleLabels(
		chartPeriod === "week" ? WEEK_DAYS : MONTHS,
		lang,
	);
	const chartLabels = trend?.labels ?? periodLabels;
	const chartValues = trend?.values ?? [];
	const hasTrendData = chartValues.some((v) => v > 0);
	const chartPeriodLabel = (() => {
		const option = CHART_PERIOD_OPTIONS.find((o) => o.id === chartPeriod);
		return option ? (isArabic ? option.label.ar : option.label.en) : "";
	})();
	const chartPeriodItems = CHART_PERIOD_OPTIONS.map((o) =>
		isArabic ? o.label.ar : o.label.en,
	);
	const frequencyItems = FREQUENCY_OPTIONS.map((o) =>
		isArabic ? o.ar : o.en,
	);

	return (
		<div className="flex flex-col gap-5 sm:gap-6 md:gap-7 lg:gap-8">
			{coreStatus === "loading" && !summary ? (
				<div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
					<SkeletonBlock className="h-[93px] sm:h-24 md:h-28" />
					<SkeletonBlock className="h-[93px] sm:h-24 md:h-28" />
				</div>
			) : coreStatus === "error" && !summary ? (
				<ErrorSectionCard
					message={
						isArabic
							? "تعذّر تحميل ملخص الإنفاق"
							: "Could not load spending summary"
					}
					onRetry={retryCore}
					isArabic={isArabic}
				/>
			) : (
				<div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
					<StatSpendingCard
						label={isArabic ? "الإنفاق الأسبوعي" : "Weekly spending"}
						amount={summary?.weeklyAmount ?? "00.00"}
						changePercent={summary?.weeklyChangePercent ?? null}
						hasData={summary?.hasData ?? false}
					/>
					<StatSpendingCard
						label={isArabic ? "الإنفاق الشهري" : "Monthly spending"}
						amount={summary?.monthlyAmount ?? "00.00"}
						changePercent={summary?.monthlyChangePercent ?? null}
						hasData={summary?.hasData ?? false}
					/>
				</div>
			)}

			<section className="flex flex-col gap-3 sm:gap-4">
				<div className="flex min-h-9 items-center justify-between gap-3 sm:min-h-11">
					<SectionTitle>
						{isArabic ? "الرسوم البيانية" : "Charts"}
					</SectionTitle>
					<div className="relative shrink-0">
						<button
							type="button"
							onClick={onChartDropdownToggle}
							className="flex h-9 min-h-11 min-w-[86px] items-center justify-end gap-2 rounded-md bg-card px-2.5 py-2 sm:h-11 sm:min-w-[100px] sm:px-3 md:min-w-[110px]"
						>
							<ChevronDown
								className="h-4 w-4 shrink-0 text-foreground"
								strokeWidth={1.25}
							/>
							<span
								className="text-[14px] font-medium text-foreground"
								style={TAJAWAL}
							>
								{chartPeriodLabel}
							</span>
						</button>
						<DropdownMenu
							open={chartDropdownOpen}
							items={chartPeriodItems}
							selected={chartPeriodLabel}
							onSelect={(label) => {
								const option = CHART_PERIOD_OPTIONS.find(
									(i) =>
										(isArabic ? i.label.ar : i.label.en) === label,
								);
								if (option) onChartPeriodChange(option.id);
							}}
							onClose={onChartDropdownClose}
						/>
					</div>
				</div>

				{trendStatus === "error" && !trend ? (
					<ErrorSectionCard
						message={
							isArabic
								? "تعذّر تحميل الرسم البياني"
								: "Could not load the chart"
						}
						onRetry={retryTrend}
						isArabic={isArabic}
					/>
				) : (
					<div className="w-full rounded-2xl border border-border bg-background py-1.5 shadow-[0px_1.94334px_11.6601px_rgba(0,0,0,0.04)] sm:rounded-[1.25rem]">
						<div className="flex items-start justify-between gap-3 px-3 pb-2 pt-2 sm:px-4 md:px-5 md:pt-3">
							<div className="flex min-w-0 flex-col items-start">
								<p
									className="text-base font-bold text-foreground sm:text-lg"
									style={TAJAWAL}
								>
									{isArabic ? "تحليل الإنفاق" : "Spending analysis"}
								</p>
								<p
									className="text-xs font-normal text-muted sm:text-sm"
									style={TAJAWAL}
								>
									{isArabic ? "يونيو 2026" : "June 2026"}
								</p>
							</div>
							<div className="flex shrink-0 flex-col items-center rounded-lg bg-brand/10 px-2 py-1 sm:px-2.5 sm:py-1.5">
								<p
									className="text-center text-[10px] font-medium text-brand sm:text-xs"
									style={TAJAWAL}
								>
									{isArabic ? "إجمالي الإنفاق" : "Total spending"}
								</p>
								<div className="flex items-center gap-0.5 text-brand">
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
								isArabic={isArabic}
							/>
						)}
					</div>
				)}
			</section>

			<section className="flex flex-col gap-3 sm:gap-4">
				<SectionTitle>
					{isArabic ? "فئات الإنفاق" : "Spending categories"}
				</SectionTitle>
				{coreStatus === "loading" && !categories ? (
					<div className="flex flex-col gap-3 sm:gap-3.5">
						<SkeletonBlock className="h-[72px] sm:h-20" />
						<SkeletonBlock className="h-[72px] sm:h-20" />
					</div>
				) : coreStatus === "error" && !categories ? (
					<ErrorSectionCard
						message={
							isArabic
								? "تعذّر تحميل فئات الإنفاق"
								: "Could not load spending categories"
						}
						onRetry={retryCore}
						isArabic={isArabic}
					/>
				) : categories && categories.length > 0 ? (
					<div className="flex flex-col gap-3 sm:gap-3.5 md:grid md:grid-cols-2 md:gap-4">
						{categories.map((category) => (
							<CategoryCard
								key={category.id}
								category={category}
								isArabic={isArabic}
							/>
						))}
					</div>
				) : (
					<EmptySectionCard>
						{isArabic
							? "لا توجد فئات لعرضها حتى الأن"
							: "No categories to show yet"}
					</EmptySectionCard>
				)}
			</section>

			<section className="flex flex-col gap-3 sm:gap-4">
				<div className="flex min-h-9 items-center justify-between gap-3 sm:min-h-11">
					<SectionTitle>
						{isArabic ? "المنتجات الأكثر شراء" : "Most purchased products"}
					</SectionTitle>
					<div className="flex shrink-0 items-center gap-2">
						<button
							type="button"
							aria-label={
								isArabic ? "تبديل طريقة العرض" : "Toggle layout"
							}
							onClick={onLayoutToggle}
							className="flex h-10 w-10 items-center justify-center rounded-md bg-brand/10 p-1 sm:h-11 sm:w-11"
						>
							<LayoutToggleIcon mode={layoutMode} />
						</button>
						<div className="relative">
							<button
								type="button"
								onClick={onFilterDropdownToggle}
								className="flex h-9 min-h-11 min-w-[86px] items-center justify-end gap-2 rounded-md bg-card px-2.5 py-2 sm:h-11 sm:min-w-[100px] sm:px-3 md:min-w-[110px]"
							>
								{filterDropdownOpen ? (
									<ChevronUp
										className="h-4 w-4 shrink-0 text-foreground"
										strokeWidth={1.25}
									/>
								) : (
									<ChevronDown
										className="h-4 w-4 shrink-0 text-foreground"
										strokeWidth={1.25}
									/>
								)}
								<span
									className="text-[14px] font-medium text-foreground"
									style={TAJAWAL}
								>
									{filterValue}
								</span>
							</button>
							<DropdownMenu
								open={filterDropdownOpen}
								items={frequencyItems}
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
							className={
								layoutMode === "grid" ? "h-[220px] sm:h-60" : "h-[90px] sm:h-24"
							}
						/>
						<SkeletonBlock
							className={
								layoutMode === "grid" ? "h-[220px] sm:h-60" : "h-[90px] sm:h-24"
							}
						/>
					</div>
				) : coreStatus === "error" && !products ? (
					<ErrorSectionCard
						message={
							isArabic
								? "تعذّر تحميل المنتجات الأكثر شراء"
								: "Could not load most purchased products"
						}
						onRetry={retryCore}
						isArabic={isArabic}
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
									isArabic={isArabic}
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
									isArabic={isArabic}
								/>
							))}
						</div>
					)
				) : (
					<ProductsEmptyInline isArabic={isArabic} />
				)}
			</section>

			<section className="flex flex-col gap-3 sm:gap-4">
				<SectionTitle>
					{isArabic ? "ملاحظات تحليلية" : "Insights"}
				</SectionTitle>
				{coreStatus === "loading" && !insights ? (
					<SkeletonBlock className="h-[64px]" />
				) : coreStatus === "error" && !insights ? (
					<ErrorSectionCard
						message={
							isArabic
								? "تعذّر تحميل الملاحظات التحليلية"
								: "Could not load insights"
						}
						onRetry={retryCore}
						isArabic={isArabic}
					/>
				) : insights && insights.length > 0 ? (
					<div className="flex flex-col gap-2.5">
						{insights.map((insight) => (
							<InsightCard key={insight.id} insight={insight} />
						))}
					</div>
				) : (
					<EmptySectionCard>
						{isArabic
							? "لا توجد ملاحظات تحليلية حتى الأن"
							: "No insights yet"}
					</EmptySectionCard>
				)}
			</section>
		</div>
	);
}

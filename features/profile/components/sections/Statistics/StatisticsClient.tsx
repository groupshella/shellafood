"use client";

import {
    ArrowUp,
    Calendar,
    ChevronDown,
    ChevronUp,
    Clock,
    Heart,
    Plus,
    TrendingUp,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { ProfileSubpageShell } from "@/features/profile/components/ProfileSubpageShell";

export interface StatisticsProduct {
    id: number;
    title: string;
    weight: string;
    currentPrice: string;
    oldPrice?: string;
    discountPercent?: number;
    imageUrl: string;
    favorited?: boolean;
}

export interface StatisticsCategory {
    id: number;
    name: string;
    purchaseCount: number;
    amount: string;
    percentage: string;
}

export interface StatisticsMonthTrend {
    month: string;
    total: string;
    operationCount: number;
    average: string;
}

export interface QidhaStatisticsData {
    availableBalance: string;
    totalBalance: string;
    creditLimit: string;
    usedBalance: string;
    highestPurchase: string;
    dailyAverage: string;
    monthlyTotal: string;
    dueTotal: string;
    paidTotal: string;
    overdueCount: number;
    pendingCount: number;
}

interface StatisticsClientProps {
    products?: StatisticsProduct[];
    categories?: StatisticsCategory[];
    monthlyTrends?: StatisticsMonthTrend[];
    qidha?: QidhaStatisticsData;
}

type StatisticsTab = "general" | "recorded";
type ChartPeriod = "week" | "month";
type ProductLayout = "list" | "grid";

const WEEK_DAYS = [
    "السبت",
    "الأحد",
    "الاثنين",
    "الثلاثاء",
    "الأربعاء",
    "الخميس",
    "الجمعة",
] as const;

const MONTHS = [
    "يناير",
    "فبراير",
    "مارس",
    "إبريل",
    "مايو",
    "يونيو",
    "يوليو",
] as const;

const WEEK_CHART_VALUES = [50, 200, 90, 220, 190, 310, 140];
const MONTH_CHART_VALUES = [120, 180, 140, 210, 260, 300, 280];
const Y_TICKS = [0, 80, 160, 240, 320];
const CHART_MAX = 320;

const FILTER_OPTIONS = ["شقة", "مكتب", "فيلا"] as const;
const CHART_PERIOD_OPTIONS: { id: ChartPeriod; label: string }[] = [
    { id: "week", label: "أسبوع" },
    { id: "month", label: "شهر" },
];

const RICE_PLACEHOLDER =
    "data:image/svg+xml," +
    encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="61" height="61" viewBox="0 0 61 61">
  <rect width="61" height="61" fill="#F6F5F8"/>
  <rect x="14" y="8" width="33" height="45" rx="4" fill="#E8DCC8" stroke="#D4C4A8"/>
  <rect x="17" y="14" width="27" height="10" rx="2" fill="#C62828"/>
  <rect x="17" y="26" width="27" height="8" rx="2" fill="#30913F"/>
</svg>`);

export const MOCK_STATISTICS_PRODUCTS: StatisticsProduct[] = [
    {
        id: 1,
        title: "الوليمة أرز مزة بسمتي هندي 5 كجم",
        weight: "5 كجم",
        currentPrice: "250",
        oldPrice: "51.95",
        discountPercent: 6,
        imageUrl: RICE_PLACEHOLDER,
        favorited: true,
    },
    {
        id: 2,
        title: "الوليمة أرز مزة بسمتي هندي 5 كجم",
        weight: "5 كجم",
        currentPrice: "250",
        imageUrl: RICE_PLACEHOLDER,
        favorited: true,
    },
    {
        id: 3,
        title: "الوليمة أرز مزة بسمتي هندي 5 كجم",
        weight: "5 كجم",
        currentPrice: "250",
        oldPrice: "51.95",
        discountPercent: 6,
        imageUrl: RICE_PLACEHOLDER,
        favorited: false,
    },
];

export const MOCK_STATISTICS_CATEGORIES: StatisticsCategory[] = [
    {
        id: 1,
        name: "برجر",
        purchaseCount: 4,
        amount: "142.50",
        percentage: "32.1%",
    },
    {
        id: 2,
        name: "الاستحمام والصابون",
        purchaseCount: 4,
        amount: "142.50",
        percentage: "32.1%",
    },
    {
        id: 3,
        name: "برجر",
        purchaseCount: 4,
        amount: "142.50",
        percentage: "32.1%",
    },
    {
        id: 4,
        name: "الاستحمام والصابون",
        purchaseCount: 4,
        amount: "142.50",
        percentage: "32.1%",
    },
];

export const MOCK_MONTHLY_TRENDS: StatisticsMonthTrend[] = [
    {
        month: "أغسطس",
        total: "3000.00",
        operationCount: 2,
        average: "3000.00",
    },
    {
        month: "سبتمبر",
        total: "3000.00",
        operationCount: 2,
        average: "3000.00",
    },
    {
        month: "أكتوبر",
        total: "0.00",
        operationCount: 0,
        average: "0.00",
    },
];

export const MOCK_QIDHA_DATA: QidhaStatisticsData = {
    availableBalance: "30.25",
    totalBalance: "3000.00",
    creditLimit: "3000.00",
    usedBalance: "3000.00",
    highestPurchase: "3000.00",
    dailyAverage: "3000.00",
    monthlyTotal: "3000.00",
    dueTotal: "3000.00",
    paidTotal: "3000.00",
    overdueCount: 3,
    pendingCount: 1,
};

const TAJAWAL = { fontFamily: "'Tajawal', sans-serif" } as const;
const AFACAD = { fontFamily: "'Afacad Flux', sans-serif" } as const;

function buildSmoothPath(points: { x: number; y: number }[]) {
    if (points.length < 2) return "";
    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i += 1) {
        const current = points[i];
        const next = points[i + 1];
        const controlX = (current.x + next.x) / 2;
        path += ` C ${controlX} ${current.y}, ${controlX} ${next.y}, ${next.x} ${next.y}`;
    }
    return path;
}

function SarIcon({
    width,
    height,
    className,
}: {
    width: number;
    height: number;
    className?: string;
}) {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 17 17"
            fill="none"
            className={className}
            aria-hidden
        >
            <path
                d="M16.0557 13.835C15.9558 14.6423 15.9119 14.9924 15.5391 15.7793L9.8125 16.9619C9.94413 16.1112 10.1191 15.4552 10.4043 15.0615L16.0557 13.835ZM8.0791 8.26465L9.79004 7.89355V2.4873C10.4276 1.7717 10.8195 1.4501 11.5889 1.04395V7.50391L16.0557 6.53418C15.9558 7.34162 15.9118 7.69164 15.5391 8.47852L11.5889 9.31348V11.1299L16.0557 10.1846C15.9558 10.9922 15.9121 11.3426 15.5391 12.1299L11.5889 12.9443V12.9619L9.79004 13.334V9.69336L8.0791 10.0547V12.3496L8.04883 12.3555C7.65527 13.0455 7.09989 13.8744 6.56445 14.5361L0.944336 15.6064C0.994737 14.8834 1.09981 14.4763 1.42676 13.748L6.2793 12.6953V10.4355L1.78125 11.3877C1.83165 10.6645 1.93761 10.2568 2.26465 9.52832L6.2793 8.65527V1.48145C6.91693 0.765707 7.30944 0.444342 8.0791 0.0380859V8.26465Z"
                fill="currentColor"
            />
        </svg>
    );
}

function GridToggleIcon() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
            <rect x="4" y="4" width="7" height="7" rx="1" fill="#30913F" />
            <rect x="13" y="4" width="7" height="7" rx="1" fill="#30913F" />
            <rect x="4" y="13" width="16" height="7" rx="1" fill="#30913F" />
        </svg>
    );
}

function DropdownMenu({
    open,
    items,
    selected,
    onSelect,
    onClose,
    className,
}: {
    open: boolean;
    items: readonly string[];
    selected: string;
    onSelect: (value: string) => void;
    onClose: () => void;
    className?: string;
}) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;
        const handlePointerDown = (event: MouseEvent) => {
            if (!ref.current?.contains(event.target as Node)) onClose();
        };
        document.addEventListener("mousedown", handlePointerDown);
        return () => document.removeEventListener("mousedown", handlePointerDown);
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div
            ref={ref}
            className={[
                "absolute top-[calc(100%+4px)] z-30 w-[86px] overflow-hidden rounded-[4px] border border-[#F6F5F8] dark:border-gray-700 bg-[#F6F5F8] dark:bg-gray-800 shadow-[0px_1px_9.6px_rgba(0,0,0,0.15)]",
                "animate-in fade-in slide-in-from-top-1 duration-200",
                className,
            ].join(" ")}
        >
            {items.map((item, index) => (
                <div key={item}>
                    <button
                        type="button"
                        onClick={() => {
                            onSelect(item);
                            onClose();
                        }}
                        className="flex h-8 w-full items-center justify-center text-[14px] font-medium text-[#343434] dark:text-gray-200 transition-colors hover:bg-white/60 dark:hover:bg-gray-700/60"
                        style={TAJAWAL}
                    >
                        {item}
                    </button>
                    {index < items.length - 1 && (
                        <div className="mx-2 border-t border-[#C6C8CE] dark:border-gray-600 opacity-40" />
                    )}
                </div>
            ))}
        </div>
    );
}

function SpendingChart({
    labels,
    values,
    showLine,
    activeIndex = 4,
}: {
    labels: readonly string[];
    values: number[];
    showLine: boolean;
    activeIndex?: number;
}) {
    const gradientId = useId();
    const [animate, setAnimate] = useState(false);

    const chartGeometry = useMemo(() => {
        const width = 341.45;
        const height = 169;
        const paddingStart = 8;
        const paddingEnd = 32;
        const paddingTop = 6;
        const paddingBottom = 22;
        const plotWidth = width - paddingStart - paddingEnd;
        const plotHeight = height - paddingTop - paddingBottom;

        const points = values.map((value, index) => {
            const x = paddingStart + (index / (values.length - 1)) * plotWidth;
            const y = paddingTop + plotHeight - (value / CHART_MAX) * plotHeight;
            return { x, y };
        });

        const linePath = buildSmoothPath(points);
        const areaPath = `${linePath} L ${points[points.length - 1].x} ${paddingTop + plotHeight} L ${points[0].x} ${paddingTop + plotHeight} Z`;

        return { width, height, paddingStart, paddingEnd, paddingTop, paddingBottom, plotHeight, plotWidth, points, linePath, areaPath };
    }, [values]);

    useEffect(() => {
        setAnimate(false);
        if (!showLine) return;
        const frame = requestAnimationFrame(() => setAnimate(true));
        return () => cancelAnimationFrame(frame);
    }, [labels.join(","), values.join(","), showLine]);

    const plotOriginX = chartGeometry.width - chartGeometry.paddingEnd;

    return (
        <div className="h-[169px] w-full">
            <svg viewBox={`0 0 ${chartGeometry.width} ${chartGeometry.height}`} className="h-full w-full overflow-visible" role="img" aria-label="تحليل الإنفاق">
                <defs>
                    <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="rgba(48, 145, 63, 0.132)" />
                        <stop offset="100%" stopColor="rgba(48, 145, 63, 0)" />
                    </linearGradient>
                </defs>

                {Y_TICKS.map((tick) => {
                    const y = chartGeometry.paddingTop + chartGeometry.plotHeight - (tick / CHART_MAX) * chartGeometry.plotHeight;
                    return (
                        <line key={tick} x1={chartGeometry.paddingStart} x2={chartGeometry.width - chartGeometry.paddingEnd} y1={y} y2={y} stroke="#F0F4F0" strokeWidth="0.971671" strokeDasharray="4 4" />
                    );
                })}

                <g
                    style={{
                        transformOrigin: `${plotOriginX}px ${chartGeometry.paddingTop + chartGeometry.plotHeight / 2}px`,
                        transform: showLine && animate ? "scaleX(1)" : "scaleX(0)",
                        transition: "transform 800ms ease-out, opacity 200ms ease",
                        opacity: showLine ? 1 : 0,
                    }}
                >
                    <path d={chartGeometry.areaPath} fill={`url(#${gradientId})`} />
                    <path d={chartGeometry.linePath} fill="none" stroke="#30913F" strokeWidth="2.42918" strokeLinecap="round" strokeLinejoin="round" />
                </g>

                {Y_TICKS.map((tick) => {
                    const y = chartGeometry.paddingTop + chartGeometry.plotHeight - (tick / CHART_MAX) * chartGeometry.plotHeight;
                    return (
                        <text key={`y-${tick}`} x={chartGeometry.width - 6} y={y + 4} textAnchor="end" fill="#555555" style={{ ...TAJAWAL, fontSize: "9.72px", fontWeight: 400 }}>
                            {tick}
                        </text>
                    );
                })}

                {labels.map((label, index) => {
                    const x = chartGeometry.paddingStart + (index / (labels.length - 1)) * (chartGeometry.width - chartGeometry.paddingStart - chartGeometry.paddingEnd);
                    const isActive = index === activeIndex;
                    return (
                        <g key={label}>
                            <text x={x} y={chartGeometry.height - 12} textAnchor="middle" fill="#111B18" style={{ ...TAJAWAL, fontSize: "10px", fontWeight: 500 }}>
                                {label}
                            </text>
                            {isActive && (
                                <rect x={x - 12} y={chartGeometry.height - 6} width={24} height={5} rx={4} fill="#30913F" />
                            )}
                        </g>
                    );
                })}
            </svg>
        </div>
    );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
    return (
        <h2 className="text-start text-[16px] font-bold leading-[160%] text-[#111B18] dark:text-gray-100" style={TAJAWAL}>
            {children}
        </h2>
    );
}

function EmptySectionCard({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-[71px] w-full items-center justify-center rounded-[18px] border border-[#F6F5F8] dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-6 shadow-[0px_1px_8px_rgba(0,0,0,0.04)]">
            <p className="text-center text-[14px] font-medium text-[#555555] dark:text-gray-400" style={TAJAWAL}>
                {children}
            </p>
        </div>
    );
}

export function StatisticsClient({
    products = [],
    categories = [],
    monthlyTrends = [],
    qidha,
}: StatisticsClientProps) {
    const [activeTab, setActiveTab] = useState<StatisticsTab>("general");
    const [chartPeriod, setChartPeriod] = useState<ChartPeriod>("week");
    const [chartDropdownOpen, setChartDropdownOpen] = useState(false);
    const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
    const [filterValue, setFilterValue] = useState<string>(FILTER_OPTIONS[0]);
    const [layoutMode, setLayoutMode] = useState<ProductLayout>("list");
    const [hearts, setHearts] = useState<Record<number, boolean>>(() =>
        Object.fromEntries(products.map((p, i) => [p.id, p.favorited ?? i < 2])),
    );
    const [heartPulse, setHeartPulse] = useState<number | null>(null);
    const [contentVisible, setContentVisible] = useState(true);

    const hasProducts = products.length > 0;
    const hasCategories = categories.length > 0;
    const hasTrends = monthlyTrends.length > 0;
    const hasQidhaData = Boolean(qidha);

    const displayAmount = hasProducts ? "3000.00" : "00.00";
    const qidhaAmount = (value?: string) => (hasQidhaData && value ? value : "00.00");
    const qidhaCount = (value?: number) => (hasQidhaData ? String(value ?? 0) : "0");

    const chartLabels = !hasProducts
        ? WEEK_DAYS
        : chartPeriod === "week"
            ? WEEK_DAYS
            : MONTHS;
    const chartValues = chartPeriod === "week" ? WEEK_CHART_VALUES : MONTH_CHART_VALUES;

    const switchTab = (tab: StatisticsTab) => {
        if (tab === activeTab) return;
        setContentVisible(false);
        window.setTimeout(() => {
            setActiveTab(tab);
            setContentVisible(true);
        }, 200);
    };

    const toggleHeart = (productId: number) => {
        setHearts((c) => ({ ...c, [productId]: !c[productId] }));
        setHeartPulse(productId);
        window.setTimeout(() => setHeartPulse(null), 300);
    };

    return (
        <ProfileSubpageShell
            title="إحصائيات"
            relaxedHeader
            showHeaderBorder={false}
            mainClassName="bg-[#F6F5F8] dark:bg-gray-800 pb-[max(2rem,env(safe-area-inset-bottom))] pt-4"
        >
            <div className="mx-auto flex w-full max-w-lg flex-col gap-6 sm:max-w-2xl lg:max-w-4xl xl:max-w-5xl">
                <div
                    role="tablist"
                    aria-label="إحصائيات"
                    className="mx-auto flex min-h-[44px] w-full items-center rounded-[12px] bg-[#F6F5F8] p-[2px] dark:bg-gray-800 sm:max-w-md"
                >
                    <button
                        type="button"
                        role="tab"
                        aria-selected={activeTab === "general"}
                        onClick={() => switchTab("general")}
                        className={[
                            "flex min-h-[40px] flex-1 items-center justify-center rounded-[12px] px-3 text-[14px] font-bold transition-[background-color,color] duration-200 sm:text-[16px]",
                            activeTab === "general"
                                ? "bg-[#30913F] text-white shadow-[0px_3px_8px_rgba(255,243,245,0.12),0px_3px_1px_rgba(0,0,0,0.04)]"
                                : "bg-transparent text-[#082E0A]",
                        ].join(" ")}
                        style={TAJAWAL}
                    >
                        عام
                    </button>
                    <div className="h-3 w-px shrink-0 bg-[#111B18]/30" aria-hidden />
                    <button
                        type="button"
                        role="tab"
                        aria-selected={activeTab === "recorded"}
                        onClick={() => switchTab("recorded")}
                        className={[
                            "flex min-h-[40px] flex-1 items-center justify-center rounded-[12px] px-3 text-[14px] font-bold transition-[background-color,color] duration-200 sm:text-[16px]",
                            activeTab === "recorded"
                                ? "bg-[#30913F] text-white shadow-[0px_3px_8px_rgba(255,243,245,0.12),0px_3px_1px_rgba(0,0,0,0.04)]"
                                : "bg-transparent text-[#082E0A]",
                        ].join(" ")}
                        style={TAJAWAL}
                    >
                        قيدها
                    </button>
                </div>

                <div className={["transition-opacity duration-200", contentVisible ? "opacity-100" : "opacity-0"].join(" ")}>
                    {activeTab === "general" ? (
                        <GeneralTabContent
                            products={products}
                            hasProducts={hasProducts}
                            displayAmount={displayAmount}
                            chartPeriod={chartPeriod}
                            chartDropdownOpen={chartDropdownOpen}
                            filterDropdownOpen={filterDropdownOpen}
                            filterValue={filterValue}
                            layoutMode={layoutMode}
                            hearts={hearts}
                            heartPulse={heartPulse}
                            chartLabels={chartLabels}
                            chartValues={chartValues}
                            onChartDropdownToggle={() => { setChartDropdownOpen((o) => !o); setFilterDropdownOpen(false); }}
                            onChartDropdownClose={() => setChartDropdownOpen(false)}
                            onChartPeriodChange={setChartPeriod}
                            onFilterDropdownToggle={() => { setFilterDropdownOpen((o) => !o); setChartDropdownOpen(false); }}
                            onFilterDropdownClose={() => setFilterDropdownOpen(false)}
                            onFilterChange={setFilterValue}
                            onLayoutToggle={() => setLayoutMode((m) => (m === "list" ? "grid" : "list"))}
                            onToggleHeart={toggleHeart}
                        />
                    ) : (
                        <RecordedTabContent
                            qidha={qidha}
                            categories={categories}
                            monthlyTrends={monthlyTrends}
                            hasCategories={hasCategories}
                            hasTrends={hasTrends}
                            hasQidhaData={hasQidhaData}
                            qidhaAmount={qidhaAmount}
                            qidhaCount={qidhaCount}
                        />
                    )}
                </div>
            </div>
        </ProfileSubpageShell>
    );
}

function GeneralTabContent({
    products,
    hasProducts,
    displayAmount,
    chartPeriod,
    chartDropdownOpen,
    filterDropdownOpen,
    filterValue,
    layoutMode,
    hearts,
    heartPulse,
    chartLabels,
    chartValues,
    onChartDropdownToggle,
    onChartDropdownClose,
    onChartPeriodChange,
    onFilterDropdownToggle,
    onFilterDropdownClose,
    onFilterChange,
    onLayoutToggle,
    onToggleHeart,
}: {
    products: StatisticsProduct[];
    hasProducts: boolean;
    displayAmount: string;
    chartPeriod: ChartPeriod;
    chartDropdownOpen: boolean;
    filterDropdownOpen: boolean;
    filterValue: string;
    layoutMode: ProductLayout;
    hearts: Record<number, boolean>;
    heartPulse: number | null;
    chartLabels: readonly string[];
    chartValues: number[];
    onChartDropdownToggle: () => void;
    onChartDropdownClose: () => void;
    onChartPeriodChange: (p: ChartPeriod) => void;
    onFilterDropdownToggle: () => void;
    onFilterDropdownClose: () => void;
    onFilterChange: (v: string) => void;
    onLayoutToggle: () => void;
    onToggleHeart: (id: number) => void;
}) {
    return (
        <div className="flex flex-col gap-6">
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <StatSpendingCard label="الإنفاق الشهري" amount={displayAmount} />
                <StatSpendingCard label="الإنفاق الأسبوعي" amount={displayAmount} />
            </div>

            <section className="flex flex-col gap-4">
                <div className="flex min-h-[33px] items-center justify-between gap-3">
                    <SectionTitle>الرسوم البيانية</SectionTitle>
                    <div className="relative shrink-0">
                        <button type="button" onClick={onChartDropdownToggle} className="flex h-[33px] min-h-11 min-w-[86px] items-center justify-end gap-2 rounded-[4px] bg-[#F6F5F8] dark:bg-gray-800 px-2.5 py-2 sm:px-[10px]">
                            <ChevronDown className="h-4 w-4 shrink-0 text-[#111B18] dark:text-gray-100" strokeWidth={1.25} />
                            <span className="text-[14px] font-medium text-[#111B18] dark:text-gray-100" style={TAJAWAL}>
                                {CHART_PERIOD_OPTIONS.find((o) => o.id === chartPeriod)?.label}
                            </span>
                        </button>
                        <DropdownMenu
                            open={chartDropdownOpen}
                            items={CHART_PERIOD_OPTIONS.map((o) => o.label)}
                            selected={CHART_PERIOD_OPTIONS.find((o) => o.id === chartPeriod)!.label}
                            onSelect={(label) => {
                                const option = CHART_PERIOD_OPTIONS.find((i) => i.label === label);
                                if (option) onChartPeriodChange(option.id);
                            }}
                            onClose={onChartDropdownClose}
                        />
                    </div>
                </div>

                <div className={["w-full rounded-[16px] border border-[#E8ECEF] dark:border-gray-700 bg-white dark:bg-gray-800 py-1.5 shadow-[0px_1.94334px_11.6601px_rgba(0,0,0,0.04)]", hasProducts ? "min-h-[249px]" : "min-h-[244px]"].join(" ")}>
                    <div className="flex items-start justify-between gap-3 px-3 pb-2 pt-2 sm:px-4">
                        <div className="min-w-0 flex flex-col items-start">
                            <p className="text-[16px] font-bold text-[#1F2937] dark:text-gray-100" style={TAJAWAL}>تحليل الإنفاق</p>
                            <p className="text-[12px] font-normal text-[#6B7280] dark:text-gray-400" style={TAJAWAL}>يونيو 2026</p>
                        </div>
                        <div className="flex shrink-0 flex-col items-center rounded-[9.72px] bg-[#E8F5E9] dark:bg-[#30913F]/15 px-2 py-1 sm:px-[9.72px] sm:py-[4.86px]">
                            <p className="text-center text-[10px] font-medium text-[#30913F] sm:text-[10.69px]" style={TAJAWAL}>إجمالي الإنفاق</p>
                            <div className="flex items-center gap-0.5 text-[#30913F]">
                                <SarIcon width={13.72} height={15.36} />
                                <span className="text-[14px] font-medium sm:text-[16px]" style={AFACAD}>{displayAmount}</span>
                            </div>
                        </div>
                    </div>
                    <SpendingChart labels={chartLabels} values={[...chartValues]} showLine={hasProducts} activeIndex={hasProducts ? 5 : 3} />
                </div>
            </section>

            <section className="flex flex-col gap-4">
                <div className="flex min-h-[33px] items-center justify-between gap-3">
                    <SectionTitle>المنتجات الأكثر شراء</SectionTitle>
                    <div className="flex shrink-0 items-center gap-2">
                        <button type="button" aria-label="تبديل طريقة العرض" onClick={onLayoutToggle} className="flex h-10 w-10 items-center justify-center rounded-[4px] bg-[#EBFEEB] dark:bg-[#30913F]/15 p-1 sm:h-11 sm:w-11">
                            <GridToggleIcon />
                        </button>
                        <div className="relative">
                            <button type="button" onClick={onFilterDropdownToggle} className="flex h-[33px] min-h-11 min-w-[86px] items-center justify-end gap-2 rounded-[4px] bg-[#F6F5F8] dark:bg-gray-800 px-2.5 py-2 sm:px-[10px]">
                                {filterDropdownOpen ? <ChevronUp className="h-4 w-4 shrink-0 text-[#111B18] dark:text-gray-100" strokeWidth={1.25} /> : <ChevronDown className="h-4 w-4 shrink-0 text-[#111B18] dark:text-gray-100" strokeWidth={1.25} />}
                                <span className="text-[14px] font-medium text-[#111B18] dark:text-gray-100" style={TAJAWAL}>التكرار</span>
                            </button>
                            <DropdownMenu open={filterDropdownOpen} items={FILTER_OPTIONS} selected={filterValue} onSelect={onFilterChange} onClose={onFilterDropdownClose} className="h-[96px]" />
                        </div>
                    </div>
                </div>

                {hasProducts ? (
                    layoutMode === "list" ? (
                        <div className="flex flex-col gap-3">
                            {products.map((product) => (
                                <ListProductCard key={product.id} product={product} favorited={hearts[product.id] ?? false} pulsing={heartPulse === product.id} onToggleHeart={() => onToggleHeart(product.id)} />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-3 xl:grid-cols-4">
                            {products.map((product) => (
                                <GridProductCard key={product.id} product={product} favorited={hearts[product.id] ?? false} pulsing={heartPulse === product.id} onToggleHeart={() => onToggleHeart(product.id)} />
                            ))}
                        </div>
                    )
                ) : (
                    <div className="mx-auto flex w-full max-w-[247px] flex-col items-center gap-6 py-4 animate-in fade-in duration-300">
                        <div className="relative aspect-[188/204] w-full max-w-[188px]">
                            <Image src="/cart/emptyCart.png" alt="" fill className="object-contain" sizes="(max-width: 343px) 60vw, 188px" priority />
                        </div>
                        <p className="text-center text-[16px] font-bold leading-[160%] text-[#111B18] dark:text-gray-100 sm:text-[18px]" style={TAJAWAL}>
                            لا توجد منتجات للعرض
                        </p>
                    </div>
                )}
            </section>
        </div>
    );
}

function RecordedTabContent({
    qidha,
    categories,
    monthlyTrends,
    hasCategories,
    hasTrends,
    hasQidhaData,
    qidhaAmount,
    qidhaCount,
}: {
    qidha?: QidhaStatisticsData;
    categories: StatisticsCategory[];
    monthlyTrends: StatisticsMonthTrend[];
    hasCategories: boolean;
    hasTrends: boolean;
    hasQidhaData: boolean;
    qidhaAmount: (value?: string) => string;
    qidhaCount: (value?: number) => string;
}) {
    return (
        <div className="flex flex-col gap-6">
            <div
                className="relative w-full overflow-hidden rounded-[24px] shadow-[0px_1px_9.6px_rgba(0,0,0,0.15)]"
                style={{ background: "linear-gradient(135deg, #1E7A2C 0%, #30913F 45%, #3EC856 100%)" }}
            >
                <div className="absolute -start-[30px] -top-[40px] h-[140px] w-[140px] rounded-[70px] bg-[rgba(255,255,255,0.06)]" />
                <div className="absolute end-[-20px] top-[61.5px] h-[180px] w-[180px] rounded-[90px] bg-[rgba(255,255,255,0.04)]" />
                <div className="absolute start-5 top-5 h-20 w-20 rounded-[40px] bg-[rgba(255,255,255,0.05)]" />
                <div className="relative flex min-h-[178px] items-start justify-between gap-4 px-4 py-6 sm:px-[22px]">
                    <div className="flex h-[41.6px] shrink-0 items-center justify-center rounded-[14px] border border-[rgba(255,255,255,0.25)] bg-[rgba(255,255,255,0.18)] px-3" style={{ borderWidth: "0.8px" }}>
                        <span className="text-[13px] font-medium text-white" style={TAJAWAL}>نشط</span>
                    </div>
                    <div className="flex min-w-0 flex-col items-end gap-1">
                        <span className="text-[14px] font-medium tracking-[0.3px] text-[rgba(255,255,255,0.75)]" style={TAJAWAL}>الرصيد المتاح</span>
                        <div className="flex flex-wrap items-center justify-end gap-1 text-white">
                            <span className="text-[clamp(28px,8vw,38px)] font-extrabold tracking-[-1px]" style={TAJAWAL}>{qidhaAmount(qidha?.availableBalance)}</span>
                            <SarIcon width={21.03} height={23.55} className="text-white" />
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="text-[11px] font-normal text-[#D1FDD2]" style={TAJAWAL}>آخر تحديث قبل دقيقة</span>
                            <span className="h-1.5 w-1.5 rounded-[3px] bg-[#A8F5B8]" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
                <BalanceStatCard label="إجمالي الرصيد" amount={qidhaAmount(qidha?.totalBalance)} sublabel="الرصيد الإجمالي" />
                <BalanceStatCard label="الحد الائتماني" amount={qidhaAmount(qidha?.creditLimit)} sublabel="الحد الأقصى المسموح" />
                <BalanceStatCard label="الرصيد المستخدم" amount={qidhaAmount(qidha?.usedBalance)} sublabel="المبلغ المنفق حتى الاَن" />
            </div>

            <section className="flex flex-col gap-3">
                <SectionTitle>تحليل الإنفاق</SectionTitle>
                <div className="grid grid-cols-3 gap-2">
                    <QidhaSpendingCard label="إجمالي الانفاق هذا الشهر" amount={qidhaAmount(qidha?.monthlyTotal)} iconBg="#EBFEEB" icon={<TrendingUp className="h-3 w-3 text-[#30913F]" strokeWidth={2.5} />} />
                    <QidhaSpendingCard label="متوسط الإنفاق اليومي" amount={qidhaAmount(qidha?.dailyAverage)} iconBg="#DFD3F5" icon={<Calendar className="h-3 w-3 text-[#7861A6]" strokeWidth={2} />} />
                    <QidhaSpendingCard label="أعلى عملية شراء" amount={qidhaAmount(qidha?.highestPurchase)} iconBg="#E8F5E9" icon={<ArrowUp className="h-3 w-3 text-[#30913F]" strokeWidth={2.5} />} />
                </div>
            </section>

            <section className="flex flex-col gap-3">
                <SectionTitle>فئات الإنفاق</SectionTitle>
                <div className="flex flex-col gap-3">
                    {hasCategories ? (
                        categories.map((category) => (
                            <CategoryCard key={category.id} category={category} />
                        ))
                    ) : (
                        <EmptySectionCard>لا توجد فئات لعرضها حتى الأن</EmptySectionCard>
                    )}
                </div>
            </section>

            <section className="flex flex-col gap-3">
                <SectionTitle>الاتجاهات الشهرية</SectionTitle>
                {hasTrends ? (
                    <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                        {monthlyTrends.map((trend) => (
                            <MonthTrendCard key={trend.month} trend={trend} isEmpty={!hasQidhaData} />
                        ))}
                    </div>
                ) : (
                    <EmptySectionCard>لا توجد إحصائيات لعرضها حتى الأن</EmptySectionCard>
                )}
            </section>

            <section className="flex flex-col gap-3">
                <SectionTitle>يوم الراتب والمدفوعات الشهرية</SectionTitle>
                <div className="flex w-full items-center gap-3 rounded-[18px] border border-[#F6F5F8] dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 shadow-[0px_1px_8px_rgba(0,0,0,0.04)]">
                    <div className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[4px] bg-[#DFD3F5]">
                        <Calendar className="h-7 w-7 text-[#111B18] dark:text-gray-100" strokeWidth={1.5} />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col items-end gap-1">
                        <span className="text-[11px] font-medium text-[#555555] dark:text-gray-400" style={TAJAWAL}>يوم الراتب</span>
                        <span className="text-[14px] font-bold text-[#1F2937] dark:text-gray-100" style={TAJAWAL}>1 من كل شهر</span>
                        <div className="flex h-[25px] items-center gap-1 rounded-[8px] px-2" style={{ background: "linear-gradient(99.16deg, #DFD3F5 -8.79%, #7861A6 90.77%)" }}>
                            <Clock className="h-3.5 w-3.5 text-white" strokeWidth={1.5} />
                            <span className="text-[12px] font-bold text-white" style={TAJAWAL}>بعد 0 يوم</span>
                        </div>
                        <span className="text-[8px] font-medium text-[#555555] dark:text-gray-400" style={TAJAWAL}>غير محدد</span>
                    </div>
                </div>
            </section>

            <section className="flex flex-col gap-3">
                <div className="flex items-center justify-between gap-3">
                    <SectionTitle>المدفوعات المستحقة</SectionTitle>
                    <div className="flex shrink-0 items-center gap-1 rounded-[8px] bg-[#FFDCDC] px-2 py-1">
                        <SarIcon width={13} height={14.56} className="text-[#CD1625]" />
                        <span className="text-[16px] font-bold text-[#DB2626] sm:text-[18px]" style={AFACAD}>{qidhaAmount(qidha?.dueTotal)}</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2 sm:gap-4">
                    <DuePaymentCard label="المعلقة" count={qidhaCount(qidha?.pendingCount)} bg="#FDF1DA" textColor="#ED9206" iconBg="#EFAD4F" />
                    <DuePaymentCard label="المتأخرة" count={qidhaCount(qidha?.overdueCount)} bg="#FFDCDC" textColor="#DB2626" iconBg="#DB2626" />
                </div>

                <div className="flex min-h-[69px] w-full flex-wrap items-center justify-between gap-2 rounded-[8px] border border-[#F6F5F8] dark:border-gray-700 bg-[#F6F5F8] dark:bg-gray-800 px-4 py-3 shadow-[0px_1px_8px_rgba(0,0,0,0.04)]">
                    <div className="flex flex-wrap items-center gap-1 text-[#111B18] dark:text-gray-100">
                        <span className="text-[16px] font-bold sm:text-[18px]" style={AFACAD}>{qidhaAmount(qidha?.dueTotal)}</span>
                        <span className="text-[14px] font-bold sm:text-[16px]" style={TAJAWAL}>من أصل</span>
                        <span className="text-[16px] font-bold sm:text-[18px]" style={AFACAD}>{qidhaAmount(qidha?.paidTotal)}</span>
                    </div>
                    <span className="text-[12px] font-bold text-[#555555] dark:text-gray-400" style={TAJAWAL}>المبلغ المستحق</span>
                </div>
            </section>
        </div>
    );
}

function BalanceStatCard({ label, amount, sublabel }: { label: string; amount: string; sublabel: string }) {
    return (
        <div className="flex min-h-[85px] min-w-0 flex-col items-center justify-center gap-0.5 rounded-[8px] bg-[#E8F5E9] dark:bg-[#30913F]/15 px-1 py-2">
            <span className="line-clamp-2 text-center text-[9px] font-medium leading-tight text-[#135017] sm:text-[10px]" style={TAJAWAL}>{label}</span>
            <div className="flex items-center gap-0.5 text-[#135017]">
                <SarIcon width={15} height={16.8} />
                <span className="text-[clamp(16px,4.5vw,20px)] font-bold tabular-nums" style={AFACAD}>{amount}</span>
            </div>
            <span className="line-clamp-2 text-center text-[7px] font-medium leading-tight text-[#135017] sm:text-[8px]" style={TAJAWAL}>{sublabel}</span>
        </div>
    );
}

function QidhaSpendingCard({ label, amount, iconBg, icon }: { label: string; amount: string; iconBg: string; icon: React.ReactNode }) {
    return (
        <div className="flex min-h-[93px] min-w-0 flex-col items-center justify-center gap-[2px] rounded-[8px] bg-[#F6F5F8] dark:bg-gray-800 px-1.5 py-3 shadow-[0px_4px_8.9px_rgba(0,0,0,0.03)] sm:px-2 sm:py-4">
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-[4px]" style={{ backgroundColor: iconBg }}>{icon}</div>
            <span className="line-clamp-2 text-center text-[7px] font-medium leading-tight text-[#555555] dark:text-gray-400 sm:text-[8px]" style={TAJAWAL}>{label}</span>
            <div className="flex items-center gap-0.5 text-[#111B18] dark:text-gray-100">
                <SarIcon width={13} height={14.56} />
                <span className="text-[clamp(14px,4vw,18px)] font-bold tabular-nums" style={AFACAD}>{amount}</span>
            </div>
        </div>
    );
}

function CategoryCard({ category }: { category: StatisticsCategory }) {
    return (
        <div className="flex min-h-[72px] w-full items-center justify-between gap-3 rounded-[18px] border border-[#F6F5F8] dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3.5 shadow-[0px_1px_8px_rgba(0,0,0,0.04)]">
            <div className="flex min-w-0 flex-1 items-center gap-3">
                <div className="h-[42px] w-[42px] shrink-0 rounded-[14px] bg-[#F6F5F8] dark:bg-gray-800" />
                <div className="flex min-w-0 flex-col items-end gap-0.5">
                    <span className="w-full truncate text-end text-[14px] font-bold text-[#1F2937] dark:text-gray-100" style={TAJAWAL}>{category.name}</span>
                    <span className="text-[11px] font-medium text-[#555555] dark:text-gray-400" style={TAJAWAL}>{category.purchaseCount} عملية شراء</span>
                </div>
            </div>
            <div className="flex shrink-0 flex-col items-start">
                <span className="text-[15px] font-bold tabular-nums text-[#1F2937] dark:text-gray-100" style={AFACAD}>{category.amount}</span>
                <span className="text-[12px] font-medium text-[#707784] dark:text-gray-500" style={TAJAWAL}>{category.percentage}</span>
            </div>
        </div>
    );
}

function MonthTrendCard({ trend, isEmpty }: { trend: StatisticsMonthTrend; isEmpty: boolean }) {
    const total = isEmpty ? "0.00" : trend.total;
    const average = isEmpty ? "0.00" : trend.average;
    const count = isEmpty ? 0 : trend.operationCount;
    const totalColor = total === "0.00" ? "#111B18" : "#30913F";

    return (
        <div className="flex h-[120px] w-[141px] shrink-0 flex-col items-end justify-center gap-0.5 rounded-[8px] border border-[#F6F5F8] dark:border-gray-700 bg-white dark:bg-gray-800 px-3.5 py-2 shadow-[0px_7px_19.8px_rgba(0,0,0,0.04)]">
            <span className="text-[12px] font-bold text-[#111B18] dark:text-gray-100" style={TAJAWAL}>{trend.month}</span>
            <div className="flex items-center gap-0.5" style={{ color: totalColor }}>
                <SarIcon width={13} height={14.56} />
                <span className="text-[18px] font-bold" style={AFACAD}>{total}</span>
            </div>
            <span className="text-[10px] font-medium text-[#555555] dark:text-gray-400" style={TAJAWAL}>{count} عملية</span>
            <div className="flex items-center gap-1 text-[#111B18] dark:text-gray-100">
                <span className="text-[10px] font-medium" style={TAJAWAL}>متوسط</span>
                <SarIcon width={9.53} height={10.68} />
                <span className="text-[12px] font-semibold" style={AFACAD}>{average}</span>
            </div>
        </div>
    );
}

function DuePaymentCard({ label, count, bg, textColor, iconBg }: { label: string; count: string; bg: string; textColor: string; iconBg: string }) {
    return (
        <div className="flex min-h-[69px] min-w-0 flex-1 items-center justify-between rounded-[8px] border border-[#F6F5F8] dark:border-gray-700 px-3 py-2 shadow-[0px_1px_8px_rgba(0,0,0,0.04)] sm:px-4" style={{ backgroundColor: bg }}>
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[5.4px]" style={{ backgroundColor: iconBg }}>
                <Calendar className="h-6 w-6 text-white" strokeWidth={1.5} />
            </div>
            <div className="flex flex-col items-end">
                <span className="text-[13px] font-bold sm:text-[14px]" style={{ ...TAJAWAL, color: textColor }}>{label}</span>
                <span className="text-[15px] font-bold tabular-nums sm:text-[16px]" style={{ ...AFACAD, color: textColor }}>{count}</span>
            </div>
        </div>
    );
}

function StatSpendingCard({ label, amount }: { label: string; amount: string }) {
    return (
        <div className="flex min-h-[93px] min-w-0 flex-col items-center justify-center gap-[2px] rounded-[8px] bg-[#F6F5F8] dark:bg-gray-800 px-3 py-4 shadow-[0px_4px_8.9px_rgba(0,0,0,0.03)] transition-[transform,opacity] duration-150 active:scale-[0.98] active:opacity-95 sm:px-[14px]">
            <div className="flex h-5 items-end justify-center gap-0.5 rounded-[4px] bg-[#FFDCDC] p-0.5">
                <span className="text-[12px] font-medium text-[#111B18] dark:text-gray-100 sm:text-[14px]" style={TAJAWAL}>100.0%</span>
                <TrendingUp className="h-4 w-4 rotate-180 text-[#111B18] dark:text-gray-100" strokeWidth={2} />
            </div>
            <p className="line-clamp-2 text-center text-[12px] font-medium text-[#111B18] dark:text-gray-100 sm:text-[14px]" style={TAJAWAL}>{label}</p>
            <div className="flex items-center gap-1 text-[#111B18] dark:text-gray-100">
                <SarIcon width={16} height={17.92} />
                <span className="text-[clamp(18px,5vw,24px)] font-bold leading-8 tabular-nums" style={AFACAD}>{amount}</span>
            </div>
        </div>
    );
}

function ListProductCard({ product, favorited, pulsing, onToggleHeart }: { product: StatisticsProduct; favorited: boolean; pulsing: boolean; onToggleHeart: () => void }) {
    return (
        <article className="relative flex w-full items-center gap-2 rounded-[8px] bg-white dark:bg-gray-800 p-2 shadow-[0px_7px_19.8px_rgba(0,0,0,0.04)] transition-[transform,opacity] duration-150 active:scale-[0.98] active:opacity-95 sm:gap-[9px] sm:p-0">
            {product.discountPercent != null && (
                <span className="absolute start-[3px] top-[3px] flex h-[15px] min-w-[31px] items-center justify-center rounded-s-[6.64px] rounded-e-none bg-[#FFDCDC] px-1">
                    <span className="text-[11px] font-bold leading-none text-[#DB2626] sm:text-[13px]" style={TAJAWAL}>-{product.discountPercent}%</span>
                </span>
            )}
            <div className="flex h-[66px] w-[66px] shrink-0 items-center justify-center rounded-[8px] bg-[#F6F5F8] dark:bg-gray-800 sm:h-[66px] sm:w-[71px]">
                <Image src={product.imageUrl} alt="" width={61} height={61} unoptimized={product.imageUrl.startsWith("data:")} className="h-[56px] w-[56px] object-contain sm:h-[61px] sm:w-[61px]" />
            </div>
            <div className="flex min-w-0 flex-1 flex-col items-end">
                <p className="line-clamp-2 w-full text-end text-[13px] font-bold leading-[140%] text-[#111B18] dark:text-gray-100 sm:text-[14px]" style={TAJAWAL}>{product.title}</p>
                <p className="text-end text-[13px] font-medium leading-snug text-[#111B18] dark:text-gray-100 sm:text-[14px]" style={TAJAWAL}>{product.weight}</p>
                <div className="flex items-center justify-end gap-0.5 px-1 py-0.5">
                    {product.oldPrice && (
                        <div className="relative flex items-center gap-0.5 text-[#707784] dark:text-gray-500">
                            <SarIcon width={8.89} height={9.96} />
                            <span className="text-[11px] font-medium leading-[120%] sm:text-[12px]" style={TAJAWAL}>{product.oldPrice}</span>
                            <span className="absolute inset-x-0 top-1/2 h-px bg-[#CD1625]" />
                        </div>
                    )}
                    <div className="flex items-center gap-0.5 text-[#111B18] dark:text-gray-100">
                        <SarIcon width={14.22} height={15.93} />
                        <span className="text-[15px] font-medium leading-[140%] sm:text-[16px]" style={TAJAWAL}>{product.currentPrice}</span>
                    </div>
                </div>
            </div>
            <div className="flex shrink-0 flex-col items-center gap-1 sm:gap-4">
                <button type="button" aria-label={favorited ? "إزالة من المفضلة" : "إضافة إلى المفضلة"} onClick={onToggleHeart} className="flex h-10 w-10 items-center justify-center sm:h-11 sm:w-11">
                    <span className={["flex h-8 w-8 items-center justify-center rounded-[35px] bg-[rgba(246,245,248,0.8)] transition-[transform] duration-200 sm:h-9 sm:w-9", pulsing ? "scale-[1.15]" : "scale-100"].join(" ")}>
                        <Heart className={["h-5 w-5 transition-[fill,color] duration-200", favorited ? "fill-[#30913F] text-[#30913F]" : "fill-none text-[#111B18] dark:text-gray-100"].join(" ")} strokeWidth={favorited ? 0 : 1.5} />
                    </span>
                </button>
                <button type="button" aria-label="إضافة إلى السلة" className="flex h-10 w-10 items-center justify-center active:scale-[0.92] sm:h-11 sm:w-11">
                    <span className="flex h-8 w-8 items-center justify-center rounded-[74.55px] bg-[#D1FDD2] sm:h-9 sm:w-9">
                        <Plus className="h-5 w-5 text-[#30913F]" strokeWidth={2.5} />
                    </span>
                </button>
            </div>
        </article>
    );
}

function GridProductCard({ product, favorited, pulsing, onToggleHeart }: { product: StatisticsProduct; favorited: boolean; pulsing: boolean; onToggleHeart: () => void }) {
    return (
        <article className="relative rounded-[8px] bg-white dark:bg-gray-800 p-3 shadow-[0px_7px_19.8px_rgba(0,0,0,0.04)] transition-[transform,opacity] duration-150 active:scale-[0.98] active:opacity-95">
            <button type="button" aria-label={favorited ? "إزالة من المفضلة" : "إضافة إلى المفضلة"} onClick={onToggleHeart} className="absolute end-3 top-3 flex h-11 w-11 items-center justify-center">
                <Heart className={["h-5 w-5 transition-[fill,color,transform] duration-200", favorited ? "fill-[#30913F] text-[#30913F]" : "fill-none text-[#707784] dark:text-gray-500", pulsing ? "scale-[1.15]" : "scale-100"].join(" ")} strokeWidth={favorited ? 0 : 1.5} />
            </button>
            {product.discountPercent != null && (
                <span className="absolute start-3 top-3 rounded bg-[#FFDCDC] px-1.5 py-0.5 text-[12px] font-bold text-[#DB2626]">-{product.discountPercent}%</span>
            )}
            <div className="mx-auto flex h-[100px] w-full items-center justify-center">
                <Image src={product.imageUrl} alt="" width={100} height={100} unoptimized={product.imageUrl.startsWith("data:")} className="h-full w-full object-contain" />
            </div>
            <div className="mt-2 text-end">
                <p className="line-clamp-2 text-[14px] font-bold text-[#111B18] dark:text-gray-100" style={TAJAWAL}>{product.title}</p>
                <p className="text-[12px] text-[#707784] dark:text-gray-500" style={TAJAWAL}>{product.weight}</p>
            </div>
            <div className="mt-2 flex items-end justify-between">
                <button type="button" aria-label="إضافة إلى السلة" className="flex h-11 w-11 items-center justify-center rounded-full bg-[#30913F] active:scale-[0.92]">
                    <Plus className="h-4 w-4 text-white" strokeWidth={2} />
                </button>
                <div className="text-end">
                    {product.oldPrice && <p className="text-[12px] text-[#707784] dark:text-gray-500 line-through" style={TAJAWAL}>{product.oldPrice}</p>}
                    <p className="text-[16px] font-bold text-[#111B18] dark:text-gray-100" style={TAJAWAL}>{product.currentPrice}</p>
                </div>
            </div>
        </article>
    );
}

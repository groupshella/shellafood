import type {
    ChartPeriod,
    QidhaStatisticsData,
    StatisticsCategory,
    StatisticsMonthTrend,
} from "@/features/profile/types/statistics.types";

export const WEEK_DAYS = [
    "السبت",
    "الأحد",
    "الاثنين",
    "الثلاثاء",
    "الأربعاء",
    "الخميس",
    "الجمعة",
] as const;

export const MONTHS = [
    "يناير",
    "فبراير",
    "مارس",
    "إبريل",
    "مايو",
    "يونيو",
    "يوليو",
] as const;

export const Y_TICKS = [0, 80, 160, 240, 320] as const;
export const CHART_MAX = 320;

/** "التكرار" — filters the most-purchased-products list (UI only until API supports it). */
export const FREQUENCY_OPTIONS = ["الأسبوع", "الشهر", "كل الوقت"] as const;

export const CHART_PERIOD_OPTIONS: { id: ChartPeriod; label: string }[] = [
    { id: "week", label: "أسبوع" },
    { id: "month", label: "شهر" },
];

export const PRODUCT_IMAGE_FALLBACK =
    "data:image/svg+xml," +
    encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="61" height="61" viewBox="0 0 61 61">
  <rect width="61" height="61" rx="8" fill="#F6F5F8"/>
  <path d="M18 40l8-10 6 7 8-11 11 14H18z" fill="#D9D9E0"/>
  <circle cx="24" cy="21" r="5" fill="#D9D9E0"/>
</svg>`);

export const ANALYTICS_ENDPOINTS = {
    summary: "/api/v1/customer/analytics/summary",
    spendingTrends: "/api/v1/customer/analytics/spending-trends",
    categoryBreakdown: "/api/v1/customer/analytics/category-breakdown",
    mostPurchasedProducts: "/api/v1/customer/analytics/most-purchased-products",
    insights: "/api/v1/customer/analytics/insights",
} as const;

/** BFF paths consumed by the client hook. */
export const ANALYTICS_BFF = {
    summary: "/api/profile/analytics/summary",
    spendingTrends: "/api/profile/analytics/spending-trends",
    categoryBreakdown: "/api/profile/analytics/category-breakdown",
    mostPurchasedProducts: "/api/profile/analytics/most-purchased-products",
    insights: "/api/profile/analytics/insights",
} as const;

export const TAJAWAL = { fontFamily: "'Tajawal', sans-serif" } as const;
export const AFACAD = { fontFamily: "'Afacad Flux', sans-serif" } as const;

/** Qidha tab — no backend yet; keep mock until endpoint exists. */
export const MOCK_STATISTICS_CATEGORIES: StatisticsCategory[] = [
    { id: 1, name: "برجر", purchaseCount: 4, amount: "142.50", percentage: "32.1%" },
    { id: 2, name: "الاستحمام والصابون", purchaseCount: 4, amount: "142.50", percentage: "32.1%" },
    { id: 3, name: "برجر", purchaseCount: 4, amount: "142.50", percentage: "32.1%" },
    { id: 4, name: "الاستحمام والصابون", purchaseCount: 4, amount: "142.50", percentage: "32.1%" },
];

export const MOCK_MONTHLY_TRENDS: StatisticsMonthTrend[] = [
    { month: "أغسطس", total: "3000.00", operationCount: 2, average: "3000.00" },
    { month: "سبتمبر", total: "3000.00", operationCount: 2, average: "3000.00" },
    { month: "أكتوبر", total: "0.00", operationCount: 0, average: "0.00" },
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

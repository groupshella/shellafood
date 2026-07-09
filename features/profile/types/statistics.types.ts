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

export interface SpendingSummary {
    weeklyAmount: string;
    monthlyAmount: string;
    weeklyChangePercent: number | null;
    monthlyChangePercent: number | null;
    hasData: boolean;
}

export interface AnalyticsInsight {
    id: string;
    title?: string;
    message: string;
    tone: "positive" | "warning" | "info";
}

export interface SpendingTrend {
    labels: string[];
    values: number[];
}

export type StatisticsTab = "general" | "recorded";
export type ChartPeriod = "week" | "month";
export type ProductLayout = "list" | "grid";
export type FetchStatus = "idle" | "loading" | "success" | "error";

export interface GeneralAnalyticsInitialData {
    summary: SpendingSummary;
    trend: SpendingTrend;
    categories: StatisticsCategory[];
    products: StatisticsProduct[];
    insights: AnalyticsInsight[];
}

import { cookies } from "next/headers";

import { COOKIE_KEYS } from "@/features/auth/types/auth.types";
import { getServerLocale } from "@/features/language/getServerLocale";
import { ANALYTICS_ENDPOINTS } from "@/features/profile/constants/statistics.constants";
import {
    adaptCategories,
    adaptInsights,
    adaptProducts,
    adaptSummary,
    adaptTrends,
    emptySummary,
    emptyTrend,
} from "@/features/profile/lib/statistics-adapters";
import type {
    AnalyticsInsight,
    ChartPeriod,
    GeneralAnalyticsInitialData,
    SpendingSummary,
    SpendingTrend,
    StatisticsCategory,
    StatisticsProduct,
} from "@/features/profile/types/statistics.types";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;
const MODULE_ID = process.env.MODULE_ID ?? "3";
const ZONE_ID = process.env.ZONE_ID ?? "[2]";

async function getAccessToken(): Promise<string | null> {
    const cookieStore = await cookies();
    return cookieStore.get(COOKIE_KEYS.ACCESS_TOKEN)?.value ?? null;
}

async function analyticsHeaders(token: string): Promise<HeadersInit> {
    const locale = await getServerLocale();
    const isArabic = locale === "ar";

    return {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "X-localization": isArabic ? "ar" : "en",
        moduleId: MODULE_ID,
        zoneId: ZONE_ID,
    };
}

async function fetchAnalyticsRaw(
    path: string,
    token: string,
    query?: Record<string, string>,
): Promise<unknown> {
    const url = new URL(`${BACKEND_URL}${path}`);
    if (query) {
        for (const [key, value] of Object.entries(query)) {
            url.searchParams.set(key, value);
        }
    }

    const res = await fetch(url.toString(), {
        headers: await analyticsHeaders(token),
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error(`Analytics ${path} failed: ${res.status}`);
    }

    const json = await res.json();
    return json?.data ?? json;
}

export async function getAnalyticsSummary(): Promise<SpendingSummary> {
    const token = await getAccessToken();
    if (!token) return emptySummary();

    try {
        const raw = await fetchAnalyticsRaw(ANALYTICS_ENDPOINTS.summary, token);
        return adaptSummary(raw);
    } catch {
        return emptySummary();
    }
}

export async function getSpendingTrends(
    period: ChartPeriod = "week",
): Promise<SpendingTrend> {
    const token = await getAccessToken();
    if (!token) return emptyTrend(period);

    try {
        const raw = await fetchAnalyticsRaw(ANALYTICS_ENDPOINTS.spendingTrends, token, {
            period,
        });
        return adaptTrends(raw, period);
    } catch {
        return emptyTrend(period);
    }
}

export async function getCategoryBreakdown(): Promise<StatisticsCategory[]> {
    const token = await getAccessToken();
    if (!token) return [];

    try {
        const raw = await fetchAnalyticsRaw(
            ANALYTICS_ENDPOINTS.categoryBreakdown,
            token,
        );
        return adaptCategories(raw);
    } catch {
        return [];
    }
}

export async function getMostPurchasedProducts(): Promise<StatisticsProduct[]> {
    const token = await getAccessToken();
    if (!token) return [];

    try {
        const raw = await fetchAnalyticsRaw(
            ANALYTICS_ENDPOINTS.mostPurchasedProducts,
            token,
        );
        return adaptProducts(raw);
    } catch {
        return [];
    }
}

export async function getAnalyticsInsights(): Promise<AnalyticsInsight[]> {
    const token = await getAccessToken();
    if (!token) return [];

    try {
        const raw = await fetchAnalyticsRaw(ANALYTICS_ENDPOINTS.insights, token);
        return adaptInsights(raw);
    } catch {
        return [];
    }
}

/** Parallel SSR load for the general tab (default week trends). */
export async function getGeneralAnalytics(
    period: ChartPeriod = "week",
): Promise<GeneralAnalyticsInitialData> {
    const [summary, trend, categories, products, insights] = await Promise.all([
        getAnalyticsSummary(),
        getSpendingTrends(period),
        getCategoryBreakdown(),
        getMostPurchasedProducts(),
        getAnalyticsInsights(),
    ]);

    return { summary, trend, categories, products, insights };
}

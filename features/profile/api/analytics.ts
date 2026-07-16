import { cookies } from "next/headers";

import { COOKIE_KEYS } from "@/features/auth/types/auth.types";
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
const LATITUDE = process.env.NEXT_PUBLIC_LATITUDE ?? "24.7136";
const LONGITUDE = process.env.NEXT_PUBLIC_LONGITUDE ?? "46.6753";

type Lang = "ar" | "en";

async function getAccessToken(): Promise<string | null> {
	const cookieStore = await cookies();
	return cookieStore.get(COOKIE_KEYS.ACCESS_TOKEN)?.value ?? null;
}

function analyticsHeaders(token: string, lang: Lang = "ar"): HeadersInit {
	return {
		Accept: "application/json",
		"Content-Type": "application/json; charset=UTF-8",
		Authorization: `Bearer ${token}`,
		"Accept-Language": lang,
		"X-localization": lang,
		lang,
		moduleId: MODULE_ID,
		zoneId: ZONE_ID,
		latitude: LATITUDE,
		longitude: LONGITUDE,
	};
}

async function fetchAnalyticsRaw(
	path: string,
	token: string,
	lang: Lang = "ar",
	query?: Record<string, string>,
): Promise<unknown> {
	const url = new URL(`${BACKEND_URL}${path}`);
	if (query) {
		for (const [key, value] of Object.entries(query)) {
			url.searchParams.set(key, value);
		}
	}

	const res = await fetch(url.toString(), {
		headers: analyticsHeaders(token, lang),
		cache: "no-store",
	});

	if (!res.ok) {
		throw new Error(`Analytics ${path} failed: ${res.status}`);
	}

	const json = await res.json();
	return json?.data ?? json;
}

export async function getAnalyticsSummary(
	lang: Lang = "ar",
): Promise<SpendingSummary> {
	const token = await getAccessToken();
	if (!token) return emptySummary();

	try {
		const raw = await fetchAnalyticsRaw(ANALYTICS_ENDPOINTS.summary, token, lang);
		return adaptSummary(raw);
	} catch {
		return emptySummary();
	}
}

export async function getSpendingTrends(
	period: ChartPeriod = "week",
	lang: Lang = "ar",
): Promise<SpendingTrend> {
	const token = await getAccessToken();
	if (!token) return emptyTrend(period, lang);

	try {
		const raw = await fetchAnalyticsRaw(
			ANALYTICS_ENDPOINTS.spendingTrends,
			token,
			lang,
			{ period },
		);
		return adaptTrends(raw, period, lang);
	} catch {
		return emptyTrend(period, lang);
	}
}

export async function getCategoryBreakdown(
	lang: Lang = "ar",
): Promise<StatisticsCategory[]> {
	const token = await getAccessToken();
	if (!token) return [];

	try {
		const raw = await fetchAnalyticsRaw(
			ANALYTICS_ENDPOINTS.categoryBreakdown,
			token,
			lang,
		);
		return adaptCategories(raw);
	} catch {
		return [];
	}
}

export async function getMostPurchasedProducts(
	period: "week" | "month" | "all" = "month",
	limit = 10,
	lang: Lang = "ar",
): Promise<StatisticsProduct[]> {
	const token = await getAccessToken();
	if (!token) return [];

	try {
		const raw = await fetchAnalyticsRaw(
			ANALYTICS_ENDPOINTS.mostPurchasedProducts,
			token,
			lang,
			{
				period,
				limit: String(limit),
			},
		);
		return adaptProducts(raw);
	} catch {
		return [];
	}
}

export async function getAnalyticsInsights(
	lang: Lang = "ar",
): Promise<AnalyticsInsight[]> {
	const token = await getAccessToken();
	if (!token) return [];

	try {
		const raw = await fetchAnalyticsRaw(ANALYTICS_ENDPOINTS.insights, token, lang);
		return adaptInsights(raw);
	} catch {
		return [];
	}
}

/** Parallel SSR load for the general tab (default week trends). */
export async function getGeneralAnalytics(
	period: ChartPeriod = "week",
	lang: Lang = "ar",
): Promise<GeneralAnalyticsInitialData> {
	const [summary, trend, categories, products, insights] = await Promise.all([
		getAnalyticsSummary(lang),
		getSpendingTrends(period, lang),
		getCategoryBreakdown(lang),
		getMostPurchasedProducts("month", 10, lang),
		getAnalyticsInsights(lang),
	]);

	return { summary, trend, categories, products, insights };
}

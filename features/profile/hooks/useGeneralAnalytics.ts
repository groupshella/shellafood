"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { ANALYTICS_BFF } from "@/features/profile/constants/statistics.constants";
import type {
	AnalyticsInsight,
	ChartPeriod,
	FetchStatus,
	GeneralAnalyticsInitialData,
	SpendingSummary,
	SpendingTrend,
	StatisticsCategory,
	StatisticsProduct,
} from "@/features/profile/types/statistics.types";
import { unwrap, type ApiResponse } from "@/shared/lib/api-response";

interface GeneralAnalyticsState {
	summary: SpendingSummary | null;
	trend: SpendingTrend | null;
	categories: StatisticsCategory[] | null;
	products: StatisticsProduct[] | null;
	insights: AnalyticsInsight[] | null;
	coreStatus: FetchStatus;
	trendStatus: FetchStatus;
}

function langHeaders(lang: "ar" | "en"): HeadersInit {
	return {
		"Accept-Language": lang,
		"X-localization": lang,
		lang,
	};
}

async function fetchBff<T>(
	path: string,
	signal: AbortSignal,
	lang: "ar" | "en",
): Promise<T> {
	const res = await fetch(path, {
		signal,
		cache: "no-store",
		headers: langHeaders(lang),
	});
	const json = (await res.json()) as ApiResponse<T>;
	return unwrap(json);
}

export function useGeneralAnalytics(params: {
	period: ChartPeriod;
	initialData?: GeneralAnalyticsInitialData | null;
	enabled?: boolean;
	/** Server-driven locale from page → client props. Do not derive client-side. */
	lang?: "ar" | "en";
}) {
	const { period, initialData = null, enabled = true, lang = "ar" } = params;

	const [state, setState] = useState<GeneralAnalyticsState>(() => ({
		summary: initialData?.summary ?? null,
		trend: initialData?.trend ?? null,
		categories: initialData?.categories ?? null,
		products: initialData?.products ?? null,
		insights: initialData?.insights ?? null,
		coreStatus: initialData ? "success" : "idle",
		trendStatus: initialData ? "success" : "idle",
	}));

	const [coreReloadKey, setCoreReloadKey] = useState(0);
	const [trendReloadKey, setTrendReloadKey] = useState(0);
	const skipInitialCore = useRef(Boolean(initialData));
	/** Skip only the first trend effect when SSR already loaded week data. */
	const skipInitialTrend = useRef(Boolean(initialData) && period === "week");

	// Summary + categories + products + insights (independent of chart period).
	useEffect(() => {
		if (!enabled) return;
		if (skipInitialCore.current && coreReloadKey === 0) {
			skipInitialCore.current = false;
			return;
		}

		const controller = new AbortController();
		setState((s) => ({ ...s, coreStatus: "loading" }));

		Promise.all([
			fetchBff<SpendingSummary>(ANALYTICS_BFF.summary, controller.signal, lang),
			fetchBff<StatisticsCategory[]>(
				ANALYTICS_BFF.categoryBreakdown,
				controller.signal,
				lang,
			),
			fetchBff<StatisticsProduct[]>(
				`${ANALYTICS_BFF.mostPurchasedProducts}?period=month&limit=10`,
				controller.signal,
				lang,
			),
			fetchBff<AnalyticsInsight[]>(
				ANALYTICS_BFF.insights,
				controller.signal,
				lang,
			),
		])
			.then(([summary, categories, products, insights]) => {
				if (controller.signal.aborted) return;
				setState((s) => ({
					...s,
					summary,
					categories,
					products,
					insights,
					coreStatus: "success",
				}));
			})
			.catch((error) => {
				if (controller.signal.aborted) return;
				console.error("[analytics] core fetch failed", error);
				setState((s) => ({ ...s, coreStatus: "error" }));
			});

		return () => controller.abort();
	}, [enabled, coreReloadKey, lang]);

	// Spending trends — refetch when week/month toggle changes.
	useEffect(() => {
		if (!enabled) return;

		if (skipInitialTrend.current) {
			skipInitialTrend.current = false;
			return;
		}

		const controller = new AbortController();
		setState((s) => ({ ...s, trendStatus: "loading" }));

		const path = `${ANALYTICS_BFF.spendingTrends}?period=${period}`;
		fetchBff<SpendingTrend>(path, controller.signal, lang)
			.then((trend) => {
				if (controller.signal.aborted) return;
				setState((s) => ({ ...s, trend, trendStatus: "success" }));
			})
			.catch((error) => {
				if (controller.signal.aborted) return;
				console.error("[analytics] trend fetch failed", error);
				setState((s) => ({ ...s, trendStatus: "error" }));
			});

		return () => controller.abort();
	}, [enabled, period, trendReloadKey, lang]);

	const retryCore = useCallback(() => setCoreReloadKey((k) => k + 1), []);
	const retryTrend = useCallback(() => setTrendReloadKey((k) => k + 1), []);

	return { ...state, retryCore, retryTrend };
}

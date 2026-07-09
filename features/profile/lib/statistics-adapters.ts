import {
    MONTHS,
    PRODUCT_IMAGE_FALLBACK,
    WEEK_DAYS,
} from "@/features/profile/constants/statistics.constants";
import type {
    AnalyticsInsight,
    ChartPeriod,
    SpendingSummary,
    SpendingTrend,
    StatisticsCategory,
    StatisticsProduct,
} from "@/features/profile/types/statistics.types";

function toNumber(value: unknown, fallback = 0): number {
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string") {
        const parsed = Number.parseFloat(value);
        if (Number.isFinite(parsed)) return parsed;
    }
    return fallback;
}

function pickFirst<T = unknown>(
    source: Record<string, unknown> | undefined,
    keys: string[],
): T | undefined {
    if (!source) return undefined;
    for (const key of keys) {
        if (source[key] !== undefined && source[key] !== null) {
            return source[key] as T;
        }
    }
    return undefined;
}

function formatSar(value: number | undefined, hasData: boolean): string {
    if (!hasData || value === undefined) return "00.00";
    return value.toFixed(2);
}

function unwrapList(json: unknown): Record<string, unknown>[] {
    if (Array.isArray(json)) return json as Record<string, unknown>[];
    const record = json as Record<string, unknown>;
    const candidates = [
        record?.data,
        record?.products,
        record?.categories,
        record?.list,
        record?.items,
        record?.insights,
    ];
    for (const candidate of candidates) {
        if (Array.isArray(candidate)) return candidate as Record<string, unknown>[];
    }
    return [];
}

export function adaptSummary(raw: unknown): SpendingSummary {
    const r = (raw ?? {}) as Record<string, unknown>;
    const weekly = pickFirst<number | string>(r, [
        "weekly_spending",
        "weeklySpending",
        "week_total",
        "weekly_amount",
    ]);
    const monthly = pickFirst<number | string>(r, [
        "monthly_spending",
        "monthlySpending",
        "month_total",
        "monthly_amount",
    ]);
    const weeklyChange = pickFirst<number | string>(r, [
        "weekly_change_percentage",
        "weekly_change_percent",
        "weeklyChangePercent",
    ]);
    const monthlyChange = pickFirst<number | string>(r, [
        "monthly_change_percentage",
        "monthly_change_percent",
        "monthlyChangePercent",
    ]);
    const hasData = toNumber(weekly, 0) > 0 || toNumber(monthly, 0) > 0;

    return {
        weeklyAmount: formatSar(weekly !== undefined ? toNumber(weekly) : undefined, hasData),
        monthlyAmount: formatSar(monthly !== undefined ? toNumber(monthly) : undefined, hasData),
        weeklyChangePercent: weeklyChange !== undefined ? toNumber(weeklyChange) : null,
        monthlyChangePercent: monthlyChange !== undefined ? toNumber(monthlyChange) : null,
        hasData,
    };
}

export function adaptTrends(raw: unknown, period: ChartPeriod): SpendingTrend {
    const r = (raw ?? {}) as Record<string, unknown>;
    const fallbackLabels = period === "week" ? WEEK_DAYS : MONTHS;

    const points = pickFirst<Record<string, unknown>[]>(r, [
        "points",
        "data",
        "trends",
        "series",
    ]);
    if (Array.isArray(points) && points.length > 0) {
        const labels = points.map(
            (p, i) =>
                (pickFirst<string>(p, ["label", "day", "month", "date"]) ??
                    fallbackLabels[i % fallbackLabels.length]) as string,
        );
        const values = points.map((p) =>
            toNumber(pickFirst(p, ["value", "total", "amount"]), 0),
        );
        return { labels, values };
    }

    const labels = pickFirst<string[]>(r, ["labels"]);
    const values = pickFirst<(number | string)[]>(r, ["values"]);
    if (Array.isArray(labels) && Array.isArray(values)) {
        return { labels, values: values.map((v) => toNumber(v, 0)) };
    }

    return { labels: [...fallbackLabels], values: fallbackLabels.map(() => 0) };
}

export function adaptCategories(raw: unknown): StatisticsCategory[] {
    return unwrapList(raw).map((item, index) => ({
        id: toNumber(pickFirst(item, ["id", "category_id"]), index),
        name: (pickFirst<string>(item, ["name", "category_name"]) ?? "").toString(),
        purchaseCount: toNumber(
            pickFirst(item, ["purchase_count", "order_count", "count"]),
            0,
        ),
        amount: formatSar(toNumber(pickFirst(item, ["amount", "total_amount"]), 0), true),
        percentage: `${toNumber(pickFirst(item, ["percentage", "percent"]), 0).toFixed(1)}%`,
    }));
}

export function adaptProducts(raw: unknown): StatisticsProduct[] {
    return unwrapList(raw).map((item, index) => {
        const price = toNumber(
            pickFirst(item, ["current_price", "price", "unit_price"]),
            0,
        );
        const oldPriceRaw = pickFirst<number | string>(item, [
            "old_price",
            "base_price",
            "previous_price",
        ]);
        const discount = pickFirst<number | string>(item, [
            "discount_percent",
            "discount",
        ]);

        return {
            id: toNumber(pickFirst(item, ["id", "product_id"]), index),
            title: (pickFirst<string>(item, ["title", "name"]) ?? "").toString(),
            weight: (pickFirst<string>(item, ["weight", "unit"]) ?? "").toString(),
            currentPrice: price.toFixed(0),
            oldPrice: oldPriceRaw !== undefined ? toNumber(oldPriceRaw).toFixed(2) : undefined,
            discountPercent: discount !== undefined ? toNumber(discount) : undefined,
            imageUrl: (pickFirst<string>(item, [
                "image_full_url",
                "image_url",
                "image",
                "thumbnail",
            ]) || PRODUCT_IMAGE_FALLBACK) as string,
            favorited: Boolean(pickFirst(item, ["is_favorite", "favorited", "wishlist"])),
        };
    });
}

export function adaptInsights(raw: unknown): AnalyticsInsight[] {
    return unwrapList(raw).map((item, index) => {
        const toneRaw = (pickFirst<string>(item, ["type", "tone"]) ?? "info").toLowerCase();
        const tone: AnalyticsInsight["tone"] =
            toneRaw.includes("warn") || toneRaw === "negative"
                ? "warning"
                : toneRaw === "positive" || toneRaw === "success"
                  ? "positive"
                  : "info";
        return {
            id: String(pickFirst(item, ["id"]) ?? index),
            title: pickFirst<string>(item, ["title"]),
            message: (
                pickFirst<string>(item, ["message", "description", "text"]) ?? ""
            ).toString(),
            tone,
        };
    });
}

export function emptySummary(): SpendingSummary {
    return {
        weeklyAmount: "00.00",
        monthlyAmount: "00.00",
        weeklyChangePercent: null,
        monthlyChangePercent: null,
        hasData: false,
    };
}

export function emptyTrend(period: ChartPeriod): SpendingTrend {
    const labels = [...(period === "week" ? WEEK_DAYS : MONTHS)];
    return { labels, values: labels.map(() => 0) };
}

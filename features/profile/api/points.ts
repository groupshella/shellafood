import {
    customerHeaders,
    FINANCIAL_API,
    getFinancialToken,
} from "@/features/profile/lib/financial-http";
import type {
    PointsHistoryGroup,
    PointsHistoryItem,
    PointsTransactionsPage,
} from "@/features/profile/types/points.types";

const BACKEND_URL = FINANCIAL_API.baseUrl;

/** Backend treats `offset` as a row offset (0, 10, 20…), not a page number. */
const DEFAULT_OFFSET = 0;
const DEFAULT_LIMIT = 10;

// ── Raw backend shape ─────────────────────────────────────────────────────────
interface LoyaltyTxnRaw {
    id: number;
    point: number;
    transaction_type?: string;
    order_id?: number | null;
    note?: string | null;
    created_at: string;
}

// ── Adapters ──────────────────────────────────────────────────────────────────
function parseDateLabel(dateStr: string, lang: "ar" | "en"): string {
    try {
        const d = new Date(dateStr.replace(" ", "T"));
        return d.toLocaleDateString(lang === "ar" ? "ar-SA" : "en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    } catch {
        return dateStr.slice(0, 10);
    }
}

function parseTimeLabel(dateStr: string, lang: "ar" | "en"): string {
    try {
        const d = new Date(dateStr.replace(" ", "T"));
        return d.toLocaleTimeString(lang === "ar" ? "ar-SA" : "en-US", {
            hour: "2-digit",
            minute: "2-digit",
        });
    } catch {
        return "";
    }
}

function txnTitle(
    type: string | undefined,
    orderId: number | null | undefined,
    lang: "ar" | "en",
): string {
    const isArabic = lang === "ar";
    if (type === "order") {
        if (orderId) return isArabic ? `طلب #${orderId}` : `Order #${orderId}`;
        return isArabic ? "طلب" : "Order";
    }
    if (type === "cashback") return isArabic ? "استرداد نقدي" : "Cashback";
    if (type === "referral") return isArabic ? "مكافأة إحالة" : "Referral reward";
    if (type === "point_to_wallet" || type === "converted") {
        return isArabic ? "تحويل إلى المحفظة" : "Converted to wallet";
    }
    return isArabic ? "معاملة نقاط" : "Points transaction";
}

function adaptRawToItem(raw: LoyaltyTxnRaw, lang: "ar" | "en"): PointsHistoryItem {
    return {
        id: String(raw.id),
        points: raw.point,
        timeLabel: parseTimeLabel(raw.created_at, lang),
        title: txnTitle(raw.transaction_type, raw.order_id, lang),
        subtitle: raw.note ?? "",
        href: raw.order_id ? `/my-orders/${raw.order_id}` : undefined,
    };
}

function groupByDate(raws: LoyaltyTxnRaw[], lang: "ar" | "en"): PointsHistoryGroup[] {
    const map = new Map<string, PointsHistoryGroup>();

    for (const raw of raws) {
        const dateLabel = parseDateLabel(raw.created_at, lang);
        const dateKey = raw.created_at.slice(0, 10);

        if (!map.has(dateKey)) {
            map.set(dateKey, { id: dateKey, dateLabel, items: [] });
        }
        map.get(dateKey)!.items.push(adaptRawToItem(raw, lang));
    }

    return Array.from(map.values());
}

function extractTxns(json: unknown): LoyaltyTxnRaw[] {
    if (!json || typeof json !== "object") return [];
    const root = json as Record<string, unknown>;
    const data = root.data;

    if (Array.isArray(data)) return data as LoyaltyTxnRaw[];
    if (data && typeof data === "object") {
        const nested = data as Record<string, unknown>;
        if (Array.isArray(nested.data)) return nested.data as LoyaltyTxnRaw[];
        if (Array.isArray(nested.transactions)) return nested.transactions as LoyaltyTxnRaw[];
    }
    if (Array.isArray(root.transactions)) return root.transactions as LoyaltyTxnRaw[];
    return [];
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * GET /api/v1/customer/loyalty-point/transactions
 * `offset` is a row offset: 0, 10, 20… (not page 1, 2, 3).
 */
export async function getLoyaltyTransactionsPage(
    offset = DEFAULT_OFFSET,
    limit = DEFAULT_LIMIT,
    lang: "ar" | "en" = "ar",
): Promise<PointsTransactionsPage> {
    const token = await getFinancialToken();
    if (!token) throw new Error(lang === "ar" ? "غير مصرح" : "Unauthorized");
    if (!BACKEND_URL) throw new Error("API URL not configured");

    const rowOffset = Math.max(0, offset);
    const pageLimit = Math.max(1, limit);

    const params = new URLSearchParams({
        offset: String(rowOffset),
        limit: String(pageLimit),
    });

    const res = await fetch(
        `${BACKEND_URL}/api/v1/customer/loyalty-point/transactions?${params}`,
        { headers: customerHeaders(token, lang), cache: "no-store" },
    );
    if (!res.ok) {
        throw new Error(
            lang === "ar"
                ? "تعذر تحميل تاريخ النقاط"
                : "Could not load points history",
        );
    }

    const json: unknown = await res.json();
    const transactions = extractTxns(json);
    return {
        groups: groupByDate(transactions, lang),
        nextOffset: rowOffset + pageLimit,
        hasMore: transactions.length === pageLimit,
    };
}

export async function getLoyaltyTransactions(
    offset = DEFAULT_OFFSET,
    limit = DEFAULT_LIMIT,
    lang: "ar" | "en" = "ar",
): Promise<PointsHistoryGroup[]> {
    const page = await getLoyaltyTransactionsPage(offset, limit, lang);
    return page.groups;
}

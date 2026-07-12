import { cookies } from "next/headers";

import { COOKIE_KEYS } from "@/features/auth/types/auth.types";
import { getServerLocale } from "@/features/language/getServerLocale";
import type { PointsHistoryGroup, PointsHistoryItem } from "@/features/profile/types/points.types";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;
const MODULE_ID = process.env.MODULE_ID ?? "3";
const ZONE_ID = process.env.ZONE_ID ?? "[2]";

async function getToken(): Promise<string | null> {
    const store = await cookies();
    return store.get(COOKIE_KEYS.ACCESS_TOKEN)?.value ?? null;
}

function authHeaders(token: string, locale: "ar" | "en"): HeadersInit {
    return {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "X-localization": locale,
        moduleId: MODULE_ID,
        zoneId: ZONE_ID,
    };
}

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
function parseDateLabel(dateStr: string, isArabic: boolean): string {
    try {
        const d = new Date(dateStr.replace(" ", "T"));
        return d.toLocaleDateString(isArabic ? "ar-SA" : "en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    } catch {
        return dateStr.slice(0, 10);
    }
}

function parseTimeLabel(dateStr: string, isArabic: boolean): string {
    try {
        const d = new Date(dateStr.replace(" ", "T"));
        return d.toLocaleTimeString(isArabic ? "ar-SA" : "en-US", { hour: "2-digit", minute: "2-digit" });
    } catch {
        return "";
    }
}

function txnTitle(type: string | undefined, orderId: number | null | undefined, isArabic: boolean): string {
    if (type === "order") {
        return orderId ? (isArabic ? `طلب #${orderId}` : `Order #${orderId}`) : (isArabic ? "طلب" : "Order");
    }
    if (type === "cashback") return isArabic ? "استرداد نقدي" : "Cashback";
    if (type === "referral_bonus" || type === "referral") return isArabic ? "مكافأة إحالة" : "Referral bonus";
    return isArabic ? "معاملة نقاط" : "Points transaction";
}

function adaptRawToItem(raw: LoyaltyTxnRaw, isArabic: boolean): PointsHistoryItem {
    return {
        id: String(raw.id),
        points: raw.point,
        timeLabel: parseTimeLabel(raw.created_at, isArabic),
        title: txnTitle(raw.transaction_type, raw.order_id, isArabic),
        subtitle: raw.note ?? "",
        href: raw.order_id ? `/my-orders/${raw.order_id}` : undefined,
    };
}

function groupByDate(raws: LoyaltyTxnRaw[], isArabic: boolean): PointsHistoryGroup[] {
    const map = new Map<string, PointsHistoryGroup>();

    for (const raw of raws) {
        const dateLabel = parseDateLabel(raw.created_at, isArabic);
        const dateKey = raw.created_at.slice(0, 10);

        if (!map.has(dateKey)) {
            map.set(dateKey, { id: dateKey, dateLabel, items: [] });
        }
        map.get(dateKey)!.items.push(adaptRawToItem(raw, isArabic));
    }

    return Array.from(map.values());
}

// ── Public API ────────────────────────────────────────────────────────────────

export async function getLoyaltyTransactions(): Promise<PointsHistoryGroup[]> {
    const locale = await getServerLocale();
    const isArabic = locale === "ar";
    const token = await getToken();
    if (!token) return [];

    try {
        const res = await fetch(
            `${BACKEND_URL}/api/v1/customer/loyalty-point/transactions`,
            { headers: authHeaders(token, locale), cache: "no-store" },
        );
        if (!res.ok) return [];

        const json = await res.json();
        const raws: LoyaltyTxnRaw[] =
            json?.data?.data ?? json?.data ?? json?.transactions ?? [];

        return groupByDate(raws, isArabic);
    } catch {
        return [];
    }
}

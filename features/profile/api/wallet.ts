import { cookies } from "next/headers";

import { COOKIE_KEYS } from "@/features/auth/types/auth.types";
import type {
    WalletHistoryFilter,
    WalletHistoryGroup,
    WalletHistoryItem,
    WalletTransactionRaw,
} from "@/features/profile/types/wallet.types";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;
const MODULE_ID = process.env.MODULE_ID ?? "3";
const ZONE_ID = process.env.ZONE_ID ?? "[2]";

async function getToken(): Promise<string | null> {
    const store = await cookies();
    return store.get(COOKIE_KEYS.ACCESS_TOKEN)?.value ?? null;
}

function authHeaders(token: string): HeadersInit {
    return {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "X-localization": "ar",
        moduleId: MODULE_ID,
        zoneId: ZONE_ID,
    };
}

// ── Adapters ──────────────────────────────────────────────────────────────────

function txnTypeToFilter(type: string): WalletHistoryFilter {
    if (type === "order") return "order";
    if (type === "loyalty_point" || type === "loyalty") return "loyalty";
    if (type === "referral_bonus" || type === "referral") return "referral";
    if (type === "cashback") return "cashback";
    return "payment";
}

function txnTypeLabel(type: string, orderId?: number | null): string {
    if (type === "order") return orderId ? `طلب #${orderId}` : "طلب";
    if (type === "loyalty_point" || type === "loyalty") return "تحويل نقاط ولاء";
    if (type === "referral_bonus" || type === "referral") return "مكافأة إحالة";
    if (type === "cashback") return "استرداد نقدي";
    return "إضافة رصيد";
}

function parseDateLabel(dateStr: string): string {
    try {
        const d = new Date(dateStr.replace(" ", "T"));
        return d.toLocaleDateString("ar-SA", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    } catch {
        return dateStr.slice(0, 10);
    }
}

function parseTimeLabel(dateStr: string): string {
    try {
        const d = new Date(dateStr.replace(" ", "T"));
        return d.toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" });
    } catch {
        return "";
    }
}

function adaptRawToItem(raw: WalletTransactionRaw): WalletHistoryItem {
    const isCredit = raw.credit > 0;
    const amount = isCredit ? raw.credit : raw.debit;
    return {
        id: String(raw.id),
        amount,
        tone: isCredit ? "credit" : "debit",
        transactionType: txnTypeToFilter(raw.transaction_type),
        title: txnTypeLabel(raw.transaction_type, raw.order_id),
        subtitle: raw.note ?? `الرصيد: ${raw.balance.toFixed(2)} ﷼`,
        timeLabel: parseTimeLabel(raw.created_at),
        href: raw.order_id ? `/my-orders/${raw.order_id}` : undefined,
    };
}

function groupByDate(raws: WalletTransactionRaw[]): WalletHistoryGroup[] {
    const map = new Map<string, WalletHistoryGroup>();

    for (const raw of raws) {
        const dateLabel = parseDateLabel(raw.created_at);
        const dateKey = raw.created_at.slice(0, 10);

        if (!map.has(dateKey)) {
            map.set(dateKey, { id: dateKey, dateLabel, items: [] });
        }
        map.get(dateKey)!.items.push(adaptRawToItem(raw));
    }

    return Array.from(map.values());
}

// ── Public API ────────────────────────────────────────────────────────────────

export async function getWalletTransactions(): Promise<WalletHistoryGroup[]> {
    const token = await getToken();
    if (!token) return [];

    try {
        const res = await fetch(
            `${BACKEND_URL}/api/v1/customer/wallet/transactions`,
            { headers: authHeaders(token), cache: "no-store" },
        );
        if (!res.ok) return [];

        const json = await res.json();
        // Backend may wrap in { data: [...] } or { transactions: [...] }
        const raws: WalletTransactionRaw[] =
            json?.data?.data ?? json?.data ?? json?.transactions ?? [];

        return groupByDate(raws);
    } catch {
        return [];
    }
}

export async function getWalletBonuses(): Promise<WalletHistoryGroup[]> {
    const token = await getToken();
    if (!token) return [];

    try {
        const res = await fetch(
            `${BACKEND_URL}/api/v1/customer/wallet/bonuses`,
            { headers: authHeaders(token), cache: "no-store" },
        );
        if (!res.ok) return [];

        const json = await res.json();
        const raws: WalletTransactionRaw[] =
            json?.data?.data ?? json?.data ?? json?.bonuses ?? [];

        return groupByDate(raws);
    } catch {
        return [];
    }
}

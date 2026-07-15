import { cookies } from "next/headers";

import { COOKIE_KEYS } from "@/features/auth/types/auth.types";
import { WALLET_TRANSACTION_TYPES } from "@/features/profile/constants/wallet.strings";
import type {
    WalletHistoryFilter,
    WalletHistoryGroup,
    WalletHistoryItem,
    WalletTransactionRaw,
} from "@/features/profile/types/wallet.types";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;
const MODULE_ID = process.env.MODULE_ID ?? "3";
const ZONE_ID = process.env.ZONE_ID ?? "[2]";

/** Backend treats `offset` as a row offset (0, 10, 20…), not a page number. */
const DEFAULT_OFFSET = 0;
const DEFAULT_LIMIT = 10;
const DEFAULT_TYPE: WalletHistoryFilter = "all";

async function getToken(): Promise<string | null> {
    const store = await cookies();
    return store.get(COOKIE_KEYS.ACCESS_TOKEN)?.value ?? null;
}

function authHeaders(token: string): HeadersInit {
    return {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json; charset=UTF-8",
        "X-localization": "ar",
        moduleId: MODULE_ID,
        zoneId: ZONE_ID,
    };
}

export function isWalletHistoryFilter(value: string): value is WalletHistoryFilter {
    return (WALLET_TRANSACTION_TYPES as readonly string[]).includes(value);
}

// ── Adapters ──────────────────────────────────────────────────────────────────

function normalizeTxnType(type: string): WalletHistoryFilter {
    const t = type.trim();
    const lower = t.toLowerCase();

    if (lower === "order") return "order";
    if (lower === "loyalty_point" || lower === "loyalty") return "loyalty_point";
    if (lower === "add_fund" || lower === "payment") return "add_fund";
    if (lower === "referrer" || lower === "referral" || lower === "referral_bonus") {
        return "referrer";
    }
    if (lower === "cashback") return "CashBack";
    if (t === "CashBack") return "CashBack";
    return "all";
}

function txnTypeLabel(type: string, orderId?: number | null): string {
    const normalized = normalizeTxnType(type);
    if (normalized === "order") return orderId ? `طلب #${orderId}` : "طلب";
    if (normalized === "loyalty_point") return "تحويل نقاط ولاء";
    if (normalized === "referrer") return "مكافأة إحالة";
    if (normalized === "CashBack") return "استرداد نقدي";
    if (normalized === "add_fund") return "إضافة رصيد";
    return "معاملة محفظة";
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
        transactionType: normalizeTxnType(raw.transaction_type),
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

function extractTxns(json: unknown): WalletTransactionRaw[] {
    if (!json || typeof json !== "object") return [];
    const root = json as Record<string, unknown>;
    const data = root.data;

    if (Array.isArray(data)) return data as WalletTransactionRaw[];
    if (data && typeof data === "object") {
        const nested = data as Record<string, unknown>;
        if (Array.isArray(nested.data)) return nested.data as WalletTransactionRaw[];
        if (Array.isArray(nested.transactions)) {
            return nested.transactions as WalletTransactionRaw[];
        }
    }
    if (Array.isArray(root.transactions)) return root.transactions as WalletTransactionRaw[];
    return [];
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * GET /api/v1/customer/wallet/transactions
 * `offset` is a row offset: 0, 10, 20… (not page 1, 2, 3).
 * `type`: all | order | loyalty_point | add_fund | referrer | CashBack
 */
export async function getWalletTransactions(
    offset = DEFAULT_OFFSET,
    limit = DEFAULT_LIMIT,
    type: WalletHistoryFilter = DEFAULT_TYPE,
): Promise<WalletHistoryGroup[]> {
    const token = await getToken();
    if (!token || !BACKEND_URL) return [];

    const rowOffset = Math.max(0, offset);
    const pageLimit = Math.max(1, limit);
    const txnType = isWalletHistoryFilter(type) ? type : DEFAULT_TYPE;

    try {
        const params = new URLSearchParams({
            offset: String(rowOffset),
            limit: String(pageLimit),
            type: txnType,
        });

        const res = await fetch(
            `${BACKEND_URL}/api/v1/customer/wallet/transactions?${params}`,
            { headers: authHeaders(token), cache: "no-store" },
        );
        if (!res.ok) return [];

        const json: unknown = await res.json();
        return groupByDate(extractTxns(json));
    } catch {
        return [];
    }
}

export async function getWalletBonuses(): Promise<WalletHistoryGroup[]> {
    const token = await getToken();
    if (!token || !BACKEND_URL) return [];

    try {
        const res = await fetch(
            `${BACKEND_URL}/api/v1/customer/wallet/bonuses`,
            { headers: authHeaders(token), cache: "no-store" },
        );
        if (!res.ok) return [];

        const json: unknown = await res.json();
        return groupByDate(extractTxns(json));
    } catch {
        return [];
    }
}

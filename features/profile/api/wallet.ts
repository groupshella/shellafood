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

type Lang = "ar" | "en";

async function getToken(): Promise<string | null> {
	const store = await cookies();
	return store.get(COOKIE_KEYS.ACCESS_TOKEN)?.value ?? null;
}

function authHeaders(token: string, lang: Lang = "ar"): HeadersInit {
	return {
		Authorization: `Bearer ${token}`,
		"Content-Type": "application/json; charset=UTF-8",
		"Accept-Language": lang,
		"X-localization": lang,
		lang,
		moduleId: MODULE_ID,
		zoneId: ZONE_ID,
	};
}

export function isWalletHistoryFilter(value: string): value is WalletHistoryFilter {
	return (WALLET_TRANSACTION_TYPES as readonly string[]).includes(value);
}

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

function txnTypeLabel(
	type: string,
	orderId: number | null | undefined,
	lang: Lang,
): string {
	const isArabic = lang === "ar";
	const normalized = normalizeTxnType(type);
	if (normalized === "order") {
		if (orderId) return isArabic ? `طلب #${orderId}` : `Order #${orderId}`;
		return isArabic ? "طلب" : "Order";
	}
	if (normalized === "loyalty_point") {
		return isArabic ? "تحويل نقاط ولاء" : "Loyalty points conversion";
	}
	if (normalized === "referrer") {
		return isArabic ? "مكافأة إحالة" : "Referral reward";
	}
	if (normalized === "CashBack") {
		return isArabic ? "استرداد نقدي" : "Cashback";
	}
	if (normalized === "add_fund") {
		return isArabic ? "إضافة رصيد" : "Add funds";
	}
	return isArabic ? "معاملة محفظة" : "Wallet transaction";
}

function parseDateLabel(dateStr: string, lang: Lang): string {
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

function parseTimeLabel(dateStr: string, lang: Lang): string {
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

function adaptRawToItem(raw: WalletTransactionRaw, lang: Lang): WalletHistoryItem {
	const isCredit = raw.credit > 0;
	const amount = isCredit ? raw.credit : raw.debit;
	const isArabic = lang === "ar";
	return {
		id: String(raw.id),
		amount,
		tone: isCredit ? "credit" : "debit",
		transactionType: normalizeTxnType(raw.transaction_type),
		title: txnTypeLabel(raw.transaction_type, raw.order_id, lang),
		subtitle:
			raw.note ??
			(isArabic
				? `الرصيد: ${raw.balance.toFixed(2)} ﷼`
				: `Balance: ${raw.balance.toFixed(2)} ﷼`),
		timeLabel: parseTimeLabel(raw.created_at, lang),
		href: raw.order_id ? `/my-orders/${raw.order_id}` : undefined,
	};
}

function groupByDate(raws: WalletTransactionRaw[], lang: Lang): WalletHistoryGroup[] {
	const map = new Map<string, WalletHistoryGroup>();

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

/**
 * GET /api/v1/customer/wallet/transactions
 * `offset` is a row offset: 0, 10, 20… (not page 1, 2, 3).
 * `type`: all | order | loyalty_point | add_fund | referrer | CashBack
 */
export async function getWalletTransactions(
	offset = DEFAULT_OFFSET,
	limit = DEFAULT_LIMIT,
	type: WalletHistoryFilter = DEFAULT_TYPE,
	lang: Lang = "ar",
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
			{ headers: authHeaders(token, lang), cache: "no-store" },
		);
		if (!res.ok) return [];

		const json: unknown = await res.json();
		return groupByDate(extractTxns(json), lang);
	} catch {
		return [];
	}
}

export async function getWalletBonuses(
	lang: Lang = "ar",
): Promise<WalletHistoryGroup[]> {
	const token = await getToken();
	if (!token || !BACKEND_URL) return [];

	try {
		const res = await fetch(`${BACKEND_URL}/api/v1/customer/wallet/bonuses`, {
			headers: authHeaders(token, lang),
			cache: "no-store",
		});
		if (!res.ok) return [];

		const json: unknown = await res.json();
		return groupByDate(extractTxns(json), lang);
	} catch {
		return [];
	}
}

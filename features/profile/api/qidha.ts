import { QIDHA_ENDPOINTS } from "@/features/profile/constants/qidha.constants";
import {
    customerHeaders,
    FINANCIAL_API,
    getFinancialToken,
} from "@/features/profile/lib/financial-http";
import {
    adaptMonthlyTrends,
    adaptQidhaCard,
    adaptQidhaStatisticsFromParts,
    adaptSalaryDay,
    adaptSpendingCategories,
    adaptTransactions,
    emptyQidhaStatistics,
} from "@/features/profile/lib/qidha-adapters";
import type { QidhaWalletApiData, QidhaWalletCard } from "@/features/profile/types/qidha.types";
import type {
    QidhaSalaryDayInfo,
    QidhaStatisticsData,
    QidhaTransactionItem,
    RecordedAnalyticsInitialData,
    StatisticsCategory,
    StatisticsMonthTrend,
} from "@/features/profile/types/statistics.types";

const BACKEND_URL = FINANCIAL_API.baseUrl;

/** GET headers for Qidha APIs (Accept is used on Qidha, unlike most customer APIs). */
function qidhaGetHeaders(token: string, lang: "ar" | "en" = "ar"): HeadersInit {
    return customerHeaders(token, lang, {
        contentType: false,
        dualModuleZone: true,
        includeGeo: true,
    });
}

/**
 * Safe Qidha GET — never throws.
 * Returns unwrapped `data` on success, otherwise `null`.
 */
async function fetchQidhaData(
    path: string,
    token: string,
    lang: "ar" | "en" = "ar",
): Promise<unknown | null> {
    if (!BACKEND_URL) return null;

    try {
        const res = await fetch(`${BACKEND_URL}${path}`, {
            method: "GET",
            headers: qidhaGetHeaders(token, lang),
            cache: "no-store",
        });

        const text = await res.text();
        if (!text) return null;

        let json: unknown;
        try {
            json = JSON.parse(text);
        } catch {
            return null;
        }

        if (!res.ok) return null;

        if (
            json &&
            typeof json === "object" &&
            "success" in json &&
            (json as { success: unknown }).success === false
        ) {
            return null;
        }

        if (json && typeof json === "object" && "data" in json) {
            return (json as { data: unknown }).data ?? null;
        }

        return json;
    } catch {
        return null;
    }
}

export interface QidhaWalletResult {
    card: QidhaWalletCard;
    fullAmountDue: number;
    minimumAmountDue: number;
}

export async function getQidhaWallet(
    userId?: number,
    lang: "ar" | "en" = "ar",
): Promise<QidhaWalletResult | null> {
    const token = await getFinancialToken();
    if (!token) return null;

    const raw = await fetchQidhaData(QIDHA_ENDPOINTS.wallet, token, lang);
    if (!raw || typeof raw !== "object") return null;

    const data = raw as QidhaWalletApiData;
    if (data.has_wallet === false) return null;

    const usedBalance = Number(data.used_balance ?? 0);
    const minimumDue = Number(
        data.minimum_due_limit ?? data.minimum_amount_due ?? usedBalance,
    );
    const fullDue = Number(data.full_amount_due ?? usedBalance);

    return {
        card: adaptQidhaCard(data, userId, lang),
        fullAmountDue: Number.isFinite(fullDue) ? fullDue : 0,
        minimumAmountDue: Number.isFinite(minimumDue) ? minimumDue : 0,
    };
}

function emptyRecorded(lang: "ar" | "en" = "ar"): RecordedAnalyticsInitialData {
    return {
        qidha: emptyQidhaStatistics(lang),
        categories: [],
        monthlyTrends: [],
        salaryDay: null,
        transactions: [],
    };
}

function buildQidhaStats(
    wallet: unknown,
    analytics: unknown,
    duePayments: unknown,
    paymentHistory: unknown,
    lang: "ar" | "en" = "ar",
): QidhaStatisticsData {
    try {
        return adaptQidhaStatisticsFromParts(
            {
                wallet,
                analytics,
                duePayments,
                paymentHistory,
            },
            lang,
        );
    } catch {
        return emptyQidhaStatistics(lang);
    }
}

function buildCategories(raw: unknown): StatisticsCategory[] {
    try {
        return adaptSpendingCategories(raw ?? {});
    } catch {
        return [];
    }
}

function buildTrends(raw: unknown): StatisticsMonthTrend[] {
    try {
        return adaptMonthlyTrends(raw ?? {});
    } catch {
        return [];
    }
}

function buildSalaryDay(raw: unknown): QidhaSalaryDayInfo | null {
    try {
        return adaptSalaryDay(raw);
    } catch {
        return null;
    }
}

function buildTransactions(raw: unknown): QidhaTransactionItem[] {
    try {
        return adaptTransactions(raw ?? {});
    } catch {
        return [];
    }
}

/** Parallel SSR/BFF loader for the Statistics "قيدها" tab. Always returns a valid shape. */
export async function getRecordedAnalytics(
    lang: "ar" | "en" = "ar",
): Promise<RecordedAnalyticsInitialData> {
    const token = await getFinancialToken();
    if (!token) return emptyRecorded(lang);

    const [
        wallet,
        analytics,
        duePayments,
        paymentHistory,
        categories,
        monthlyTrends,
        salaryDay,
        transactions,
    ] = await Promise.all([
        fetchQidhaData(QIDHA_ENDPOINTS.wallet, token, lang),
        fetchQidhaData(QIDHA_ENDPOINTS.analyticsSummary, token, lang),
        fetchQidhaData(QIDHA_ENDPOINTS.duePayments, token, lang),
        fetchQidhaData(QIDHA_ENDPOINTS.paymentHistory, token, lang),
        fetchQidhaData(QIDHA_ENDPOINTS.spendingCategories, token, lang),
        fetchQidhaData(QIDHA_ENDPOINTS.monthlyTrends, token, lang),
        fetchQidhaData(QIDHA_ENDPOINTS.salaryDay, token, lang),
        fetchQidhaData(QIDHA_ENDPOINTS.transactions, token, lang),
    ]);

    return {
        qidha: buildQidhaStats(wallet, analytics, duePayments, paymentHistory, lang),
        categories: buildCategories(categories),
        monthlyTrends: buildTrends(monthlyTrends),
        salaryDay: buildSalaryDay(salaryDay),
        transactions: buildTransactions(transactions),
    };
}

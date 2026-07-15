import { QIDHA_STATUS_LABELS } from "@/features/profile/constants/qidha.constants";
import { QIDHA_STRINGS } from "@/features/profile/constants/qidha.strings";
import type { QidhaWalletApiData, QidhaWalletCard } from "@/features/profile/types/qidha.types";
import type {
    QidhaSalaryDayInfo,
    QidhaStatisticsData,
    QidhaTransactionItem,
    StatisticsCategory,
    StatisticsMonthTrend,
} from "@/features/profile/types/statistics.types";

function toNumber(value: unknown, fallback = 0): number {
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string") {
        const parsed = Number.parseFloat(value);
        if (Number.isFinite(parsed)) return parsed;
    }
    return fallback;
}

function asRecord(value: unknown): Record<string, unknown> | undefined {
    if (value && typeof value === "object" && !Array.isArray(value)) {
        return value as Record<string, unknown>;
    }
    return undefined;
}

function formatAmount(value: unknown): string {
    return toNumber(value).toFixed(2);
}

function statusLabel(status: unknown): string {
    const key = String(status ?? "active").toLowerCase();
    return QIDHA_STATUS_LABELS[key] ?? QIDHA_STRINGS.available;
}

/** Normalize payload that may already be unwrapped (`data`) or still enveloped. */
function asPayload(raw: unknown): Record<string, unknown> {
    const root = asRecord(raw);
    if (!root) return {};
    // Only unwrap one nested `data` object when the envelope still wraps fields.
    if ("data" in root && asRecord(root.data) && !("wallet_info" in root) && !("categories" in root) && !("transactions" in root) && !("monthly_data" in root) && !("salary_day" in root) && !("available_balance" in root) && !("summary" in root)) {
        return asRecord(root.data) ?? root;
    }
    return root;
}

export function emptyQidhaStatistics(): QidhaStatisticsData {
    return {
        availableBalance: "00.00",
        totalBalance: "00.00",
        creditLimit: "00.00",
        usedBalance: "00.00",
        highestPurchase: "00.00",
        dailyAverage: "00.00",
        monthlyTotal: "00.00",
        dueTotal: "00.00",
        paidTotal: "00.00",
        overdueCount: 0,
        pendingCount: 0,
        statusLabel: QIDHA_STRINGS.available,
        usedPercentage: 0,
    };
}

export function adaptQidhaCard(
    data: QidhaWalletApiData,
    userId?: number,
): QidhaWalletCard {
    const available = toNumber(data.available_balance);
    const creditLimit = toNumber(data.credit_limit, Math.max(available, 0));
    const usedBalance = toNumber(
        data.used_balance,
        Math.max(0, creditLimit - available),
    );

    const cardNumber =
        data.serial_number ??
        data.card_number ??
        `2026${String(userId ?? 0).padStart(8, "0")}`.slice(0, 12);

    return {
        availableBalance: available,
        usedBalance,
        creditLimit,
        cardNumber,
        expiryDate: data.lock_day ?? data.expiry_date ?? "—",
        statusLabel: statusLabel(data.status),
    };
}

export function adaptQidhaStatisticsFromParts(parts: {
    wallet?: unknown;
    analytics?: unknown;
    duePayments?: unknown;
    paymentHistory?: unknown;
}): QidhaStatisticsData {
    const wallet = asPayload(parts.wallet);
    const analytics = asPayload(parts.analytics);
    const dueRoot = asPayload(parts.duePayments);
    const historyRoot = asPayload(parts.paymentHistory);

    const walletInfo = asRecord(analytics.wallet_info) ?? wallet;
    const spending = asRecord(analytics.spending_analytics) ?? {};
    const analyticsDue = asRecord(analytics.due_payments) ?? {};
    const dueSummary = asRecord(dueRoot.summary) ?? analyticsDue;
    const historySummary = asRecord(historyRoot.summary) ?? {};

    const available = toNumber(walletInfo.available_balance);
    const creditLimit = toNumber(walletInfo.credit_limit);
    const usedBalance = toNumber(walletInfo.used_balance);

    return {
        availableBalance: formatAmount(available),
        totalBalance: formatAmount(creditLimit || available + usedBalance),
        creditLimit: formatAmount(creditLimit),
        usedBalance: formatAmount(usedBalance),
        highestPurchase: formatAmount(spending.highest_single_purchase),
        dailyAverage: formatAmount(spending.average_daily_spending),
        monthlyTotal: formatAmount(spending.total_spent_this_period),
        dueTotal: formatAmount(
            dueSummary.total_due_amount ?? analyticsDue.total_due_amount,
        ),
        paidTotal: formatAmount(
            historySummary.total_paid ?? dueSummary.paid_this_period,
        ),
        overdueCount: toNumber(
            dueSummary.overdue_count ?? analyticsDue.overdue_payments,
        ),
        pendingCount: toNumber(dueSummary.pending_count),
        statusLabel: statusLabel(walletInfo.status ?? wallet.status),
        usedPercentage: toNumber(
            wallet.used_percentage ?? walletInfo.used_percentage,
        ),
    };
}

export function adaptSpendingCategories(raw: unknown): StatisticsCategory[] {
    const data = asPayload(raw);
    const list = Array.isArray(data.categories)
        ? data.categories
        : Array.isArray(raw)
          ? raw
          : [];

    return list.map((item, index) => {
        const row = asRecord(item) ?? {};
        return {
            id: toNumber(row.category_id ?? row.id, index),
            name: String(
                row.category_name_ar ?? row.category_name ?? row.name ?? "",
            ).trim(),
            purchaseCount: toNumber(row.transaction_count ?? row.purchase_count),
            amount: formatAmount(row.total_spent ?? row.amount),
            percentage: `${toNumber(row.percentage).toFixed(1)}%`,
        };
    });
}

export function adaptMonthlyTrends(raw: unknown): StatisticsMonthTrend[] {
    const data = asPayload(raw);
    const list = Array.isArray(data.monthly_data)
        ? data.monthly_data
        : Array.isArray(raw)
          ? raw
          : [];

    const mapped = list.map((item) => {
        const row = asRecord(item) ?? {};
        return {
            month: String(row.month_name_ar ?? row.month_name ?? row.month ?? ""),
            total: formatAmount(row.total_spent ?? row.total),
            operationCount: toNumber(row.transaction_count ?? row.operation_count),
            average: formatAmount(row.average_order_value ?? row.average),
            sortKey: String(row.month ?? ""),
            spent: toNumber(row.total_spent),
        };
    });

    const withActivity = mapped.filter((m) => m.spent > 0);
    const source = withActivity.length > 0 ? withActivity : mapped.slice(-3);

    return source
        .sort((a, b) => a.sortKey.localeCompare(b.sortKey))
        .slice(-6)
        .map(({ month, total, operationCount, average }) => ({
            month,
            total,
            operationCount,
            average,
        }));
}

export function adaptSalaryDay(raw: unknown): QidhaSalaryDayInfo | null {
    if (raw == null) return null;
    const data = asPayload(raw);
    if (!("salary_day" in data) && !("next_salary_date" in data)) return null;

    return {
        salaryDay: toNumber(data.salary_day),
        nextSalaryDate: String(data.next_salary_date ?? ""),
        daysUntilSalary: toNumber(data.days_until_salary),
        salaryAmount: formatAmount(data.salary_amount),
        isPaymentDue: Boolean(data.is_payment_due),
        dueRatio: toNumber(data.due_payments_vs_salary_ratio),
    };
}

export function adaptTransactions(raw: unknown): QidhaTransactionItem[] {
    const data = asPayload(raw);
    const list = Array.isArray(data.transactions)
        ? data.transactions
        : Array.isArray(raw)
          ? raw
          : [];

    return list.map((item, index) => {
        const row = asRecord(item) ?? {};
        const metadata = asRecord(row.metadata) ?? {};
        return {
            id: toNumber(row.id, index),
            storeName: String(metadata.store_name ?? "—"),
            amount: formatAmount(row.amount),
            type: String(row.type ?? "debit"),
            createdAt: String(row.created_at ?? ""),
            description: String(row.description ?? ""),
        };
    });
}

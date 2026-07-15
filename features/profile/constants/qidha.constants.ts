export const QIDHA_ENDPOINTS = {
    wallet: "/api/qidha-wallet/get-wallet",
    store: "/api/qidha-wallet/store",
    transactions: "/api/qidha-wallet/transactions",
    analyticsSummary: "/api/qidha-wallet/analytics/summary",
    duePayments: "/api/qidha-wallet/due-payments",
    paymentHistory: "/api/qidha-wallet/payment-history",
    spendingCategories: "/api/qidha-wallet/spending-categories",
    monthlyTrends: "/api/qidha-wallet/monthly-trends",
    salaryDay: "/api/qidha-wallet/salary-day",
} as const;

/** BFF paths consumed by the client. */
export const QIDHA_BFF = {
    recorded: "/api/profile/qidha/recorded",
    wallet: "/api/profile/qidha/wallet",
    store: "/api/profile/qidha/store",
} as const;

export const QIDHA_STATUS_LABELS: Record<string, string> = {
    active: "نشط",
    inactive: "غير نشط",
    locked: "مقفلة",
    suspended: "معلّقة",
};

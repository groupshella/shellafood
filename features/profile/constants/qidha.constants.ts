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

export const QIDHA_STATUS_LABELS: Record<string, { ar: string; en: string }> = {
	active: { ar: "نشط", en: "Active" },
	inactive: { ar: "غير نشط", en: "Inactive" },
	locked: { ar: "مقفلة", en: "Locked" },
	suspended: { ar: "معلّقة", en: "Suspended" },
};

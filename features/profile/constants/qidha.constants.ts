export const QIDHA_ENDPOINTS = {
	wallet: "/api/qidha-wallet/get-wallet",
	store: "/api/qidha-wallet/store",
	credit: "/api/qidha-wallet/credit",
	debit: "/api/qidha-wallet/debit",
	transactions: "/api/qidha-wallet/transactions",
	analyticsSummary: "/api/qidha-wallet/analytics/summary",
	duePayments: "/api/qidha-wallet/due-payments",
	paymentHistory: "/api/qidha-wallet/payment-history",
	spendingCategories: "/api/qidha-wallet/spending-categories",
	monthlyTrends: "/api/qidha-wallet/monthly-trends",
	salaryDay: "/api/qidha-wallet/salary-day",
	nafath: {
		initiate: "/api/qidha-wallet/nafath/initiate",
		checkStatus: "/api/qidha-wallet/nafath/checkStatus",
		cancel: "/api/qidha-wallet/nafath/cancel",
		retry: "/api/qidha-wallet/nafath/retry",
		sign: "/api/qidha-wallet/nafath/sign",
	},
} as const;

/** BFF paths consumed by the client. */
export const QIDHA_BFF = {
	recorded: "/api/profile/qidha/recorded",
	wallet: "/api/profile/qidha/wallet",
	store: "/api/profile/qidha/store",
	credit: "/api/profile/qidha/credit",
	debit: "/api/profile/qidha/debit",
	nafath: {
		initiate: "/api/profile/qidha/nafath/initiate",
		checkStatus: "/api/profile/qidha/nafath/check-status",
		cancel: "/api/profile/qidha/nafath/cancel",
		retry: "/api/profile/qidha/nafath/retry",
		sign: "/api/profile/qidha/nafath/sign",
	},
} as const;

export const QIDHA_STATUS_LABELS: Record<string, { ar: string; en: string }> = {
	active: { ar: "نشط", en: "Active" },
	inactive: { ar: "غير نشط", en: "Inactive" },
	locked: { ar: "مقفلة", en: "Locked" },
	suspended: { ar: "معلّقة", en: "Suspended" },
};

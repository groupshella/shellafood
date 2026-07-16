import type {
	WalletHistoryFilter,
	WalletPaymentMethod,
} from "@/features/profile/types/wallet.types";

export type LocaleCopy = { ar: string; en: string };

export const WALLET_STRINGS = {
	pageTitle: { ar: "محفظتي", en: "My wallet" },
	availableBalance: { ar: "الرصيد المتاح", en: "Available balance" },
	historyTitle: { ar: "تاريخ المحفظة", en: "Wallet history" },
	emptyMessage: {
		ar: "لا يوجد معاملات في الوقت الحالي",
		en: "No transactions at the moment",
	},
	addBalance: { ar: "أضف رصيد", en: "Add balance" },
	addBalanceTitle: { ar: "إضافة رصيد", en: "Add balance" },
	amountQuestion: {
		ar: "ما المبلغ الذي تريد إضافته في المحفظة ؟",
		en: "How much would you like to add to your wallet?",
	},
	paymentMethods: { ar: "طرق الدفع", en: "Payment methods" },
} as const;

/** Filter ids match backend `type` query values exactly. */
export const WALLET_FILTER_OPTIONS: {
	id: WalletHistoryFilter;
	label: LocaleCopy;
}[] = [
	{ id: "all", label: { ar: "كل الحركات المالية", en: "All transactions" } },
	{ id: "order", label: { ar: "معاملات الطلب", en: "Order transactions" } },
	{
		id: "loyalty_point",
		label: {
			ar: "تم تحويل من نقطة الولاء",
			en: "Converted from loyalty points",
		},
	},
	{
		id: "add_fund",
		label: {
			ar: "تمت الإضافة عبر طريقة الدفع",
			en: "Added via payment method",
		},
	},
	{
		id: "referrer",
		label: {
			ar: "المكتسبة عن طريق الإحالة",
			en: "Earned via referral",
		},
	},
	{
		id: "CashBack",
		label: {
			ar: "معاملات الاسترداد النقدي",
			en: "Cashback transactions",
		},
	},
];

export const WALLET_TRANSACTION_TYPES = WALLET_FILTER_OPTIONS.map((o) => o.id);

export const WALLET_QUICK_AMOUNTS = [50, 150, 250] as const;

export const WALLET_PAYMENT_METHODS: WalletPaymentMethod[] = [
	{ id: "visa_master", label: "VISA / MASTER" },
	{ id: "stc_pay", label: "Stc pay" },
	{ id: "mada", label: "Mada Card" },
	{ id: "apple_pay", label: "Apple Pay" },
];

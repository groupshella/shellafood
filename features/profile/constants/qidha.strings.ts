import type { QidhaPaymentMethod } from "@/features/profile/types/qidha.types";

export const QIDHA_STRINGS = {
	pageTitle: { ar: "محفظة قيدها", en: "Qidha wallet" },
	available: { ar: "متاح", en: "Available" },
	availableBalance: { ar: "الرصيد المتاح", en: "Available balance" },
	usedBalance: { ar: "الرصيد المستخدم", en: "Used balance" },
	selectCard: { ar: "حدد البطاقة", en: "Select card" },
	expiryLabel: { ar: "تاريخ انتهاء الشهر", en: "Month end date" },
	paymentOptions: { ar: "خيارات الدفع", en: "Payment options" },
	fullAmountDue: { ar: "المبلغ المستحق بالكامل", en: "Full amount due" },
	minimumAmountDue: { ar: "المبلغ الأدنى المستحق", en: "Minimum amount due" },
	enterOtherAmount: { ar: "أدخل مبلغ آخر", en: "Enter another amount" },
	choosePaymentMethod: {
		ar: "اختر طريقة الدفع",
		en: "Choose payment method",
	},
	payNow: { ar: "ادفع الآن", en: "Pay now" },
} as const;

export const QIDHA_PAYMENT_METHODS: QidhaPaymentMethod[] = [
	{ id: "stc_pay", label: "stc pay", sublabel: "Debit Card" },
	{ id: "visa_master", label: "VISA / MASTER" },
	{ id: "mada", label: "Mada Card" },
];

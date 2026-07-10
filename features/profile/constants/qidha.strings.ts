import type { QidhaPaymentMethod } from "@/features/profile/types/qidha.types";

export const QIDHA_STRINGS = {
    pageTitle: "محفظة قيدها",
    available: "متاح",
    availableBalance: "الرصيد المتاح",
    usedBalance: "الرصيد المستخدم",
    selectCard: "حدد البطاقة",
    expiryLabel: "تاريخ انتهاء الشهر",
    paymentOptions: "خيارات الدفع",
    fullAmountDue: "المبلغ المستحق بالكامل",
    minimumAmountDue: "المبلغ الأدنى المستحق",
    enterOtherAmount: "أدخل مبلغ آخر",
    choosePaymentMethod: "اختر طريقة الدفع",
    payNow: "ادفع الآن",
} as const;

export const QIDHA_PAYMENT_METHODS: QidhaPaymentMethod[] = [
    { id: "stc_pay", label: "stc pay", sublabel: "Debit Card" },
    { id: "visa_master", label: "VISA / MASTER" },
    { id: "mada", label: "Mada Card" },
];

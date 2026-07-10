import type {
    WalletHistoryFilter,
    WalletPaymentMethod,
} from "@/features/profile/types/wallet.types";

export const WALLET_STRINGS = {
    pageTitle: "محفظتي",
    availableBalance: "الرصيد المتاح",
    historyTitle: "تاريخ المحفظة",
    emptyMessage: "لا يوجد معاملات في الوقت الحالي",
    addBalance: "أضف رصيد",
    addBalanceTitle: "إضافة رصيد",
    amountQuestion: "ما المبلغ الذي تريد إضافته في المحفظة ؟",
    paymentMethods: "طرق الدفع",
} as const;

export const WALLET_FILTER_OPTIONS: {
    id: WalletHistoryFilter;
    label: string;
}[] = [
    { id: "all", label: "كل الحركات المالية" },
    { id: "order", label: "معاملات الطلب" },
    { id: "loyalty", label: "تم تحويل من نقطة الولاء" },
    { id: "payment", label: "تمت الإضافة عبر طريقة الدفع" },
    { id: "referral", label: "المكتسبة عن طريق الإحالة" },
    { id: "cashback", label: "معاملات الاسترداد النقدي" },
];

export const WALLET_QUICK_AMOUNTS = [50, 150, 250] as const;

export const WALLET_PAYMENT_METHODS: WalletPaymentMethod[] = [
    { id: "visa_master", label: "VISA / MASTER" },
    { id: "stc_pay", label: "Stc pay" },
    { id: "mada", label: "Mada Card" },
    { id: "apple_pay", label: "Apple Pay" },
];

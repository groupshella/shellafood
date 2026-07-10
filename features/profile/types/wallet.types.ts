export type WalletHistoryFilter =
    | "all"
    | "order"
    | "loyalty"
    | "payment"
    | "referral"
    | "cashback";

export type WalletTxnTone = "credit" | "debit";

export interface WalletHistoryItem {
    id: string;
    amount: number;
    timeLabel: string;
    title: string;
    subtitle: string;
    tone: WalletTxnTone;
    href?: string;
}

export interface WalletHistoryGroup {
    id: string;
    dateLabel: string;
    items: WalletHistoryItem[];
}

export type WalletPaymentMethodId =
    | "visa_master"
    | "stc_pay"
    | "mada"
    | "apple_pay";

export interface WalletPaymentMethod {
    id: WalletPaymentMethodId;
    label: string;
}

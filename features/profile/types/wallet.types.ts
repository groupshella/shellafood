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
    transactionType?: WalletHistoryFilter;
    href?: string;
}

// ── Raw backend shape ─────────────────────────────────────────────────────────
export interface WalletTransactionRaw {
    id: number;
    transaction_type: string;
    credit: number;
    debit: number;
    balance: number;
    note?: string | null;
    order_id?: number | null;
    created_at: string;
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

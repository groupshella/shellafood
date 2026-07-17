/** Backend `type` query values for wallet transactions. */
export type WalletHistoryFilter =
    | "all"
    | "order"
    | "loyalty_point"
    | "add_fund"
    | "referrer"
    | "CashBack";

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

export type WalletTransferSource = "wallet" | "wallet_qidha";

export interface WalletRecipient {
    id?: string | number;
    recipient_id?: string | number;
    name?: string | null;
    recipient_name?: string | null;
    phone?: string | null;
    recipient_phone?: string | null;
}

export interface ValidateWalletRecipientRequest {
    phone: string;
}

export interface ValidateWalletRecipientResponse {
    valid?: boolean;
    name?: string;
    phone?: string;
    recipient?: WalletRecipient;
    [key: string]: unknown;
}

export interface AddWalletRecipientRequest {
    recipient_phone: string;
    recipient_name: string;
}

export interface WalletTransferRequest {
    recipient_phone: string;
    amount: number;
    payment_source: WalletTransferSource;
    save_recipient?: boolean;
    recipient_nickname?: string;
    message?: string;
}

export interface WalletTransferResponse {
    transaction_id?: string | number;
    message?: string;
    [key: string]: unknown;
}

export interface WalletAddFundRequest {
    amount: number;
    payment_method: "myfatoorah";
    payment_platform: "web";
    callback: string;
}

export interface WalletAddFundResponse {
    payment_url?: string;
    paymentUrl?: string;
    invoice_id?: string | number;
    invoiceId?: string | number;
    payment_id?: string | number;
    paymentId?: string | number;
    [key: string]: unknown;
}

export type QidhaPayOption = "full" | "minimum" | "custom";

// ── Raw backend shape (get-wallet) ────────────────────────────────────────────
export interface QidhaWalletApiData {
    has_wallet?: boolean;
    id?: number;
    status?: string | null;
    credit_limit?: number | null;
    available_balance?: number | null;
    used_balance?: number | null;
    minimum_due_limit?: number | null;
    full_amount_due?: number | null;
    minimum_amount_due?: number | null;
    used_percentage?: number | null;
    lock_day?: string | null;
    serial_number?: string | null;
    signature_status?: boolean | number | null;
    signature_path?: string | null;
    card_number?: string | null;
    expiry_date?: string | null;
}

export type QidhaPaymentMethodId = "stc_pay" | "visa_master" | "mada";

export interface QidhaWalletCard {
    availableBalance: number;
    usedBalance: number;
    creditLimit: number;
    cardNumber: string;
    expiryDate: string;
    statusLabel: string;
}

export interface QidhaPaymentMethod {
    id: QidhaPaymentMethodId;
    label: string;
    sublabel?: string;
}

export type QidhaPayOption = "full" | "minimum" | "custom";

// ── Raw backend shape ─────────────────────────────────────────────────────────
export interface QidhaWalletApiData {
    available_balance?: number | null;
    credit_limit?: number | null;
    used_balance?: number | null;
    card_number?: string | null;
    expiry_date?: string | null;
    status?: string | null;
    full_amount_due?: number | null;
    minimum_amount_due?: number | null;
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

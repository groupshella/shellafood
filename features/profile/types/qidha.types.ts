export type QidhaPayOption = "full" | "minimum" | "custom";

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

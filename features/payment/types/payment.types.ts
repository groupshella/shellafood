// features/payment/types/payment.types.ts

/**
 * Payload the client sends to OUR backend (BFF) to create a MyFatoorah
 * embedded session. Notice: no card fields here, ever.
 */
export interface CreateSessionRequest {
    order_id: number;
    amount: number;
    currency: string; // "SAR"
    language: "AR" | "EN";
    save_card: boolean;
    retrieve_saved_tokens: boolean;
    supported_payment_methods: ["card"];
}

export interface SavedCard {
    token: string;
    brand: string; // "Visa" | "MasterCard" | "Mada" | ...
    maskedCard: string; // "5277 **** **** 2262"
}

export interface CreateSessionData {
    session_id: string;
    session_expiry: string;
    operation_type: string;
    amount: number;
    currency: string;
    order_id: number;
    customer_reference: string;
    save_card_available: boolean;
    saved_cards: SavedCard[];
    supported_payment_methods: string[];
    encryption_key?: string;
}

export interface CreateSessionResponse {
    success: boolean;
    message: string;
    data: CreateSessionData;
}

export type PaymentStatusKeyType = "PaymentId" | "InvoiceId" | "CustomerReference";

export interface CheckStatusRequest {
    key_type: PaymentStatusKeyType;
    key: string;
}

export type InvoiceStatus = "Paid" | "Pending" | "Failed" | "Canceled" | "Expired";

export interface CheckStatusData {
    invoice_id?: string;
    payment_id?: string;
    invoice_status: InvoiceStatus;
    order_id?: number;
    amount?: number;
    currency?: string;
}

export interface CheckStatusResponse {
    success: boolean;
    message: string;
    data: CheckStatusData;
}

/**
 * Local UI state machine for the payment screen.
 * This never holds card data — only orchestration state.
 */
export type PaymentScreenStatus =
    | "creating_session" // calling our backend for session_id
    | "widget_loading" // MyFatoorah script/component is mounting
    | "ready" // widget mounted, user can pay
    | "processing" // user pressed pay, MyFatoorah is handling it
    | "checking_status" // we're calling check-status after MyFatoorah callback
    | "success"
    | "pending"
    | "failed";

/**
 * Minimal shape of what MyFatoorah's callback gives us.
 * We do NOT trust this for the final decision — we always confirm
 * via our backend's check-status endpoint.
 */
export interface MyFatoorahCallbackResponse {
    paymentCompleted?: boolean;
    sessionId?: string;
    invoiceId?: string | number;
    paymentId?: string;
    customerReference?: string;
    paymentData?: string;
    card?: {
        brand?: string;
    };
    isSuccess?: boolean;
    error?: unknown;
}

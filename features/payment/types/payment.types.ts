/**
 * Payment method as returned by the real backend endpoint.
 * Field names are PascalCase (MyFatoorah convention).
 * Optional fields are present for some methods only.
 */
export interface PaymentMethod {
    PaymentMethodId: number;
    PaymentMethodAr: string;
    PaymentMethodEn: string;
    PaymentMethodCode: string;
    /** Per-method fee added on top of the order total. May be absent (treat as 0). */
    ServiceCharge?: number;
    /** order total + ServiceCharge. May be absent. */
    TotalAmount?: number;
    IsDirectPayment?: boolean;
    /** URL of the payment method logo. May be absent. */
    ImageUrl?: string;
}

// ── Process payment (hosted flow) ─────────────────────────────────────────────

export interface ProcessPaymentRequest {
    order_id: number;
    amount: number;
    currency: string;
    payment_method_id: number;
    customer_name: string;
    customer_phone: string;
    customer_email: string;
}

export interface ProcessPaymentData {
    payment_url: string;
    invoice_id: string;
}

// ── Check payment status ──────────────────────────────────────────────────────

export interface CheckStatusRequest {
    key_type: "InvoiceId" | "PaymentId";
    key: string;
}

export type InvoiceStatus = "Paid" | "Pending" | "InProgress" | "Failed" | "Canceled" | "Expired";
export type PaymentOrderStatus = "paid" | "partially_paid" | "unpaid";

export interface CheckStatusData {
    InvoiceStatus: InvoiceStatus;
    order?: {
        payment_status: PaymentOrderStatus;
        order_status: string;
    };
}

// ── Result classification (mirrors checkout_controller.dart logic) ────────────

export type PaymentResult = "success" | "pending" | "failed";

/**
 * Classify the check-status response using the same decision logic as the
 * Flutter app (checkout_controller.dart:1271-1315).
 *
 * order.payment_status == "paid" | "partially_paid"  →  success
 * InvoiceStatus == Pending | InProgress, or payment_status == unpaid,
 *   or order_status == payment_pending                →  pending
 * anything else                                       →  failed
 */
export function classifyPaymentResult(data: CheckStatusData): PaymentResult {
    const paymentStatus = data.order?.payment_status;
    const orderStatus = data.order?.order_status;
    const invoiceStatus = data.InvoiceStatus;

    if (paymentStatus === "paid" || paymentStatus === "partially_paid") {
        return "success";
    }

    if (
        invoiceStatus === "Pending" ||
        invoiceStatus === "InProgress" ||
        paymentStatus === "unpaid" ||
        orderStatus === "payment_pending"
    ) {
        return "pending";
    }

    return "failed";
}

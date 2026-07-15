import type { CheckoutStoreSummary } from "@/features/checkout/types/store-summary.types";
import type { FormattedCheckoutInvoice } from "@/features/checkout/lib/invoice";

export type DeliveryMethodType = "delivery" | "pickup";

export type PaymentMethodType = "my-wallet" | "qidha-wallet" | "electronic" | null;

export type ElectronicPaymentType = "visa-master" | "mada" | "apple-pay" | "stc-pay" | null;

export interface CartItem {
    id: number;
    name: string;
    imageUrl?: string;
}

/** Display invoice — kept in sync by CheckoutContext when address/method changes. */
export type CheckoutInvoice = FormattedCheckoutInvoice;

export interface PlaceOrderCartItem {
    item_id: number;
    quantity: number;
    price: number;
}

/** Snapshot of everything needed to call POST /api/v1/customer/order/place. */
export interface PlaceOrderPayload {
    cart: PlaceOrderCartItem[];
    order_amount: number;
    payment_method: "digital_payment" | "cash_on_delivery" | "wallet";
    order_type: DeliveryMethodType;
    store_id: number;
    distance: number;
    address: string;
    longitude: string;
    latitude: string;
    contact_person_name: string;
    contact_person_number: string;
}

export interface PlaceOrderResponse {
    order_id: number;
}

export interface PlaceOrderResult {
    success: boolean;
    data?: PlaceOrderResponse;
    message?: string;
}

export interface CheckoutData {
    orderId?: number;
    cartItems: CartItem[];
    cartCount: number;
    deliveryMethod: DeliveryMethodType;
    deliveryAddress: string;
    deliveryAddressShort: string;
    walletBalance: string;
    myWalletBalance: string;
    /** Numeric subtotal from cart — used to recalculate invoice on the client. */
    subtotal: number;
    invoice: CheckoutInvoice;
    storeSummary: CheckoutStoreSummary | null;
    /** Ready-to-send payload for the place-order API. Built server-side in checkout/page.tsx. */
    placeOrderPayload: PlaceOrderPayload;
}

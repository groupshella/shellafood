export type DeliveryMethodType = "delivery" | "pickup";

export type PaymentMethodType = "my-wallet" | "qidha-wallet" | "electronic" | null;

export type ElectronicPaymentType = "visa-master" | "mada" | "apple-pay" | "stc-pay" | null;

export interface SavedAddress {
    id: number;
    label: string;
    address: string;
}

export interface CartItem {
    id: number;
    name: string;
    imageUrl?: string;
}

export interface CheckoutInvoice {
    subtotal: string;
    deliveryFee: string;
    serviceFee: string;
    discount: string;
    total: string;
}

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

export interface CheckoutData {
    orderId: number;
    cartItems: CartItem[];
    cartCount: number;
    deliveryMethod: DeliveryMethodType;
    deliveryAddress: string;
    deliveryAddressShort: string;
    walletBalance: string;
    myWalletBalance: string;
    invoice: CheckoutInvoice;
    /** Ready-to-send payload for the place-order API. Built server-side in checkout/page.tsx. */
    placeOrderPayload: PlaceOrderPayload;
}

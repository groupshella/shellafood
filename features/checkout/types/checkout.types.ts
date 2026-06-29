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

export interface CheckoutData {
    cartItems: CartItem[];
    cartCount: number;
    deliveryMethod: DeliveryMethodType;
    deliveryAddress: string;
    deliveryAddressShort: string;
    walletBalance: string;
    myWalletBalance: string;
    invoice: CheckoutInvoice;
}


export interface CartItem {
    id: string;          // cart row id
    productId: string;
    productName: string;
    productImage: string;
    quantity: number;
    priceAtAdd: number;
    storeId: string;
    storeName: string;
    stock: number;
    hasDiscount: boolean;
    discountAmount: number;
}

export interface ApiCartItem {
    id: number;
    item_id: number;
    quantity: number;
    price: number;
    original_price: number;
    discount_amount: number;
    item: {
        id: number;
        name: string;
        image_full_url: string;
        image: string;
        store_id: number;
        store_name: string;
        stock: number;
        unit_type: string;
    };
}

export type PaymentMethod = 'cash' | 'wallet' | 'kaidha' | 'myfatoorah' | 'offline';

export interface DeliveryAddress {
    id?: number;
    address: string;
    latitude: string;
    longitude: string;
}

export interface OrderTotals {
    total: number;
}

export interface CheckoutOptions {
    items: CartItem[];
    address: DeliveryAddress;
    paymentMethod: PaymentMethod;
    totals: OrderTotals;
    couponCode?: string;
    offlineMethodId?: string;
    offlineNote?: string;
    offlineFields?: Record<string, string>;
}

export interface CheckoutResult {
    success: boolean;
    orderId?: string;
    error?: string;
    /** Only present for myfatoorah — caller must redirect to this URL */
    paymentUrl?: string;
}


export interface UsePaymentReturn {
    selectedPaymentMethod: PaymentMethod | null;
    selectedOfflineMethodId: string | null;
    offlineCustomerNote: string;
    offlineFieldValues: Record<string, string>;

    selectPaymentMethod: (method: PaymentMethod) => void;
    selectOfflineMethod: (methodId: string) => void;
    setOfflineCustomerNote: (note: string) => void;
    setOfflineFieldValue: (fieldName: string, value: string) => void;
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface OfflineMethodField {
    input_name: string;
    placeholder: string;
    is_required: boolean;
}

export interface OfflineMethod {
    id: number;
    method_name: string;
    method_fields?: OfflineMethodField[];
}

export interface QidhaWallet {
    availableBalance: number;
    creditLimit: number;
    purchaseLimit: number;
    status: string;
}

export interface UsePaymentDetailsReturn {
    walletBalance: number | null;      // set when method === 'wallet'
    qidhaWallet: QidhaWallet | null; // set when method === 'kaidha'
    offlineMethods: OfflineMethod[];    // set when method === 'offline'
    isLoading: boolean;
    error: string | null;
    hasInsufficientBalance: boolean;
    isPaymentReady: boolean;
}
/**
 * Cart Feature Types
 */

// ============================================================================
// Cart Item Types
// ============================================================================

export interface CartItem {
    id: string;
    productId: string;
    productName: string;
    productNameAr?: string;
    productImage?: string;
    quantity: number;
    priceAtAdd: number;
    originalPrice?: number;
    storeId: string;
    storeName: string;
    storeNameAr?: string;
    storeLogo?: string;
    stock?: number;
    unit?: string;
    unitAr?: string;
    hasSpecialOffer?: boolean;
    discountAmount?: number;
}

// ============================================================================
// Cart State Types
// ============================================================================

export interface CartTotals {
    subtotal: number;
    deliveryFee: number;
    taxFee: number;
    discount: number;
    total: number;
    itemsCount: number;
    remainingForFreeDelivery: number | 0;
}

// ============================================================================
// API Response Types
// ============================================================================

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
        image: string;
        image_full_url: string;
        store_id: number;
        store_name: string;
        stock: number;
        unit_type: string;
        discounted_price: number;
        original_price: number;
    };
}

export interface CartResponse {
    success: boolean;
    data?: any;
    message?: string;
    error?: string;
}

export interface AddToCartPayload {
    item_id: number;
    guest_id: string;
    model: string;
    price: number;
    quantity: number;
    variation: any[];
    add_on_ids: any[];
    add_on_qtys: any[];
}

export interface UpdateCartPayload {
    cart_id: string;
    price: number;
    quantity: number;
    guest_id?: string;
}
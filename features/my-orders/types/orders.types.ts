// ── API response types ────────────────────────────────────────────────────────

export interface ApiOrderModule {
    id: number;
    module_name: string;
    module_type: string;
}

export interface ApiOrderStore {
    id: number;
    name: string;
    logo_full_url: string;
    module_id: number;
    module?: ApiOrderModule;
}

export interface ApiOrder {
    id: number;
    order_status: string;
    created_at: string;
    order_date: string;   // "2026-06-27"
    order_time: string;   // "9:07 am"
    module_id: number;
    module_name: string;
    module_type: string;
    order_amount?: number;
    store: ApiOrderStore;
}

export interface OrderListApiResponse {
    total_size: number;
    limit: string;
    offset: number;
    orders: ApiOrder[];
}

// ── UI / detail types ─────────────────────────────────────────────────────────

export type OrderStatus = "preparing" | "completed" | "cancelled";

export interface OrderItem {
    id: number;
    name: string;
    description: string;
    price: string;
    originalPrice?: string;
    quantity: number;
    imageUrl?: string;
}

export interface Order {
    id: number;
    storeName: string;
    storeDescription: string;
    storeLogoUrl?: string;
    orderNum: string;
    date: string;
    orderDate: string;
    status: OrderStatus;
    total: string;
    subtotal: string;
    deliveryFee: string;
    serviceFee: string;
    discount: string;
    items: OrderItem[];
    moduleId: number;
    moduleName: string;
    moduleType: string;
    paymentMethod: string;
    orderAddress: string;
}

export interface FilterState {
    date: string;
    timePeriod: string | null;
    statuses: OrderStatus[];
}

// ── Date group label ──────────────────────────────────────────────────────────

export type DateGroupLabel = "اليوم" | "الأمس" | "الأقدم";

export interface OrderDateGroup {
    label: DateGroupLabel;
    orders: ApiOrder[];
}

// ── Order track (GET /api/v1/customer/order/track) ────────────────────────────

export interface OrderTrackStore {
    id: number;
    name: string;
    logo_full_url?: string;
    address?: string;
}

export interface OrderTrackDeliveryAddress {
    address?: string;
    contact_person_name?: string;
    contact_person_number?: string;
}

export interface OrderTrackPayment {
    amount?: number;
    payment_status?: string;
    payment_method?: string;
}

export interface OrderTrack {
    id: number;
    order_status: string;
    created_at: string;
    order_amount: number;
    delivery_charge?: number;
    additional_charge?: number;
    coupon_discount_amount?: number;
    store_discount_amount?: number;
    flash_store_discount_amount?: number;
    flash_admin_discount_amount?: number;
    payment_method: string;
    cancellation_reason?: string;
    store: OrderTrackStore;
    delivery_address?: OrderTrackDeliveryAddress | string;
    payments?: OrderTrackPayment[];
}

// ── Order details (GET /api/v1/customer/order/details) ────────────────────────

export interface OrderDetailItemDetails {
    id: number;
    name: string;
    description?: string;
}

export interface ApiOrderDetailItem {
    id: number;
    item_id: number;
    order_id: number;
    price: number;
    quantity: number;
    discount_on_item?: number;
    discount_type?: string;
    image_full_url?: string;
    variation?: unknown[];
    add_ons?: unknown[];
    item_details: OrderDetailItemDetails;
}

// ── Computed fees (client-side from track + details) ────────────────────────

export interface OrderFees {
    itemsSubtotal: number;
    deliveryCharge: number;
    serviceFee: number;
    couponDiscount: number;
    total: number;
}

// ── View model passed to OrderDetailClient ──────────────────────────────────

export interface OrderDetailView {
    id: number;
    storeId: number;
    storeName: string;
    storeDescription: string;
    storeLogoUrl?: string;
    items: OrderItem[];
    fees: OrderFees;
    paymentMethod: string;
    deliveryAddress: string;
    orderDate: string;
    orderStatus: string;
    cancellationReason?: string;
}

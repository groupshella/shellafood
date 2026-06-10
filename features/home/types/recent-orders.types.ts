// ── Get Recent Orders ─────────────────────────────────────────────────────────

export type OrderType = "delivery" | "take_away" | "parcel" | string;
export type OrderStatus = "delivered" | "refunded" | string;

export interface RecentOrder {
    id: number;
    store_name: string;
    store_logo: string;
    order_type: OrderType;
    order_status: OrderStatus;
    order_date: string;
}

/** Raw Laravel `GET .../customer/order/recent` response. */
export interface GetRecentOrdersResponse {
    status: boolean;
    message: string;
    orders: RecentOrder[];
}


/** Normalised shape used by UI components */
export interface Notification {
    id: number;
    title: string;
    description: string;
    image?: string | null;
    image_full_url?: string | null;
    status?: 0 | 1;
    created_at: string;
}

/** Payload nested under each item from GET /api/v1/customer/notifications */
export interface NotificationData {
    title: string;
    description: string;
    order_id?: number;
    image?: string;
    type?: string;
    order_status?: string;
    alternative_store_ids?: number[];
}

/** Raw item from GET /api/v1/customer/notifications */
export interface NotificationApiItem {
    id: number;
    data: NotificationData;
    status: 0 | 1;
    user_id?: number;
    vendor_id?: number | null;
    delivery_man_id?: number | null;
    created_at: string;
    updated_at: string;
}

export interface GetNotificationsResponse {
    total_size?: number;
    limit?: number;
    offset?: number;
    notifications: NotificationApiItem[];
}

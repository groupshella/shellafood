// ── Get Discounted Stores ─────────────────────────────────────────────────────

export interface Discount {
    id: number;
    start_date: string;
    end_date: string;
    start_time: string;
    end_time: string;
    min_purchase: number;
    max_discount: number;
    discount: number;
    discount_type: "percent" | "amount" | string;
    store_id: number;
}

export interface DiscountedStore {
    id: number;
    name: string;
    slug: string;
    logo_full_url: string;
    cover_photo_full_url: string;
    avg_rating: number;
    rating_count: number;
    delivery_time: string;
    minimum_order: number;
    free_delivery: boolean;
    discount_status: boolean;
    discount: Discount | null;
    open: number | boolean;
    distance?: number;
}

export interface GetDiscountedStoresResponse {
    total_size: number;
    limit: number;
    offset: number;
    stores: DiscountedStore[];
}

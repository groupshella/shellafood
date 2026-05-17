// ─── Store API Types ────────────────────────────────────────────────────────

export interface StoreRating {
    rating: number;
    total: number;
}

export interface StoreBadge {
    type: string;
    label: string;
    label_ar: string;
    icon: string | null;
    color: string;
}

export interface StoreDelivery {
    delivery_available: boolean;
    delivery_time_range: string | null;
    minimum_delivery_time: number | null;
    maximum_delivery_time: number | null;
    delivery_radius: number;
    delivery_fee: number;
    free_delivery_threshold: number | null;
    takeaway_available: boolean;
    takeaway_time: string;
    dine_in_available: boolean;
    preparation_time: string;
    estimated_wait_time: string | null;
}

export interface StoreStatus {
    is_open: boolean;
    is_busy: boolean;
    busy_level: "quiet" | "normal" | "busy" | "very_busy";
    current_orders: number;
    estimated_wait_time: string | null;
    next_available_slot: string | null;
    delivery_available: boolean;
    takeaway_available: boolean;
    last_updated: string;
}

export interface ApiStore {
    id: number;
    is_open: boolean;
    name: string;
    phone: string;
    email: string | null;
    logo: string | null;
    logo_full_url: string | null;
    cover_photo: string | null;
    cover_photo_full_url: string | null;
    address: string;
    latitude: string | null;
    longitude: string | null;
    minimum_order: number;
    delivery_time: string | null;
    rating: number[];
    avg_rating: number;
    rating_count: number;
    order_count: number;
    free_delivery: boolean;
    minimum_shipping_charge: number;
    featured: number;
    zone_id: number;
    module_id: number;
    active: boolean;
    open: number;
    veg: number;
    non_veg: number;
    badges: StoreBadge[];
    tags: string[];
    delivery: StoreDelivery;
    status: StoreStatus;
    distance?: number;
    slug: string | null;
}

export interface StoreListResponse {
    total_size: number;
    limit: number;
    offset: number;
    stores: ApiStore[];
}

// Query params shared across store list endpoints
export interface StoreQueryParams {
    limit?: number;
    offset?: number;
    type?: "all" | "veg" | "non_veg";
    sort_by?: "recommended" | "distance" | "ratings_desc" | "delivery_time_asc";
    featured?: boolean;
    filter?: string;
}
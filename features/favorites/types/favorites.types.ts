// ── Wishlist ──────────────────────────────────────────────────────────────────

export interface FavoriteProduct {
    id: number;
    name: string;
    image: string | null;
    price: number;
    discount: number | null;
    discount_type: string | null;
    discounted_price: number | null;
    unit_type: string | null;
    unit_amount: number | null;
    store_id: number;
    created_at: string;
}

export interface FavoriteStore {
    id: number;
    name: string;
    logo: string | null;
    banner: string | null;
    rating: number | null;
    delivery_time: number | null;
    free_delivery: boolean;
    module_type: string | null;
    module_id: number | null;
    created_at: string;
}

export interface WishlistResponse {
    item: FavoriteProduct[];
    store: FavoriteStore[];
}

// ── Orders tab ───────────────────────────────────────────────────────────────

export interface ApiOrder {
    id: number;
    order_status: string;
    order_amount: number;
    created_at: string;
    updated_at: string;
    restaurant?: {
        id: number;
        name: string;
        logo?: string | null;
    };
    store?: {
        id: number;
        name: string;
        logo?: string | null;
    };
    order_note?: string | null;
    delivery_address?: { address: string } | null;
    details_count?: number;
    order_time?: string;
    schedule_at?: string | null;
}

export interface OrderListResponse {
    total_size: number;
    limit: string;
    offset: number;
    orders: ApiOrder[];
}

// ── Tabs ─────────────────────────────────────────────────────────────────────

export type FavoritesTab = "products" | "stores" | "orders";

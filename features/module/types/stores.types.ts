// ── Get Stores ────────────────────────────────────────────────────────────────

export interface Store {
    id: number;
    name: string;
    logo: string;
    cover_photo: string;
    avg_rating: number;
    rating_count: number;
    delivery_time: string | null;
    distance: number;
    is_open: boolean;
    module_id: number;
    free_delivery?: boolean;
}

export interface GetStoresResponse {
    total_size: number;
    limit: string | number;
    offset: string | number;
    stores: Store[];
}


export interface DiscountedStore {
    id: number;
    name: string;
    slug: string;
    logo_full_url: string;
    cover_photo_full_url: string;
    avg_rating: number;
    rating_count: number;
    delivery_time: string;
    free_delivery: boolean;
    discount_status: boolean;
    is_open: boolean;
}

export interface GetDiscountedStoresResponse {
    total_size: number;
    limit: number;
    offset: number;
    stores: DiscountedStore[];
}

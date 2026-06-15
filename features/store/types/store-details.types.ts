

export interface StoreDetailsCategory {
    id: number;
    name: string;
    full_image_url: string;
}

export interface StoreDetails {
    store_name: string;
    store_description: string;
    rating: number;
    rating_count: number;
    free_delivery: boolean;
    delivery_time: string | null;
    cover_photo_full_url: string;
    logo_full_url: string;
    module_id: number;
    category_details: StoreDetailsCategory[];
}

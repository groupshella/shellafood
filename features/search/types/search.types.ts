import { Store } from "@/features/markets/types/stores.types";

export interface SearchProduct {
    id: number;
    name: string;
    image_full_url: string;
    price: number;
    discount: number;
    discounted_price: number;
    module_id: number;
    availability?: {
        is_available: boolean;
    };
}

export interface SearchItemsResponse {
    total_size: number;
    limit: number;
    offset: number;
    products: SearchProduct[];
}

export interface SearchStoresResponse {
    total_size: number;
    limit: number;
    offset: number;
    stores: Store[];
}

export interface SearchResults {
    items: SearchItemsResponse;
    stores: SearchStoresResponse;
}

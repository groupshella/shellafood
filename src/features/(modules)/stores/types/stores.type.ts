export interface Store {
    id: number;
    name: string;
    module_id: number;
    logo: string;
    cover_photo: string;
    avg_rating: number;
    rating_count: number;
    delivery_time: string;
    distance: number;
    is_open: boolean;
}

export interface Stores {
    total_size: number;
    limit: number;
    offset: number;
    stores: Store[];
}


export type StoreListEndpoint =
    | 'latest'
    | 'popular'
    | 'recommended'
    | 'discounted'
    | 'top-rated'
    | 'top-offer';

// Maps each endpoint to the Laravel path segment
export const STORE_LARAVEL_PATHS: Record<StoreListEndpoint, string> = {
    latest: 'stores/latest',
    popular: 'stores/popular',
    recommended: 'stores/recommended',
    discounted: 'stores/get-stores', // uses filter param
    'top-rated': 'stores/top-rated',
    'top-offer': 'stores/top-offer-near-me',
};

// Maps each endpoint to the Next.js internal API route
export const STORE_API_PATHS: Record<StoreListEndpoint, string> = {
    latest: '/api/stores/latest',
    popular: '/api/stores/popular',
    recommended: '/api/stores/recommended',
    discounted: '/api/stores/discounted',
    'top-rated': '/api/stores/top-rated',
    'top-offer': '/api/stores/top-offer',
};

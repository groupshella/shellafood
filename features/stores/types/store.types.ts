export interface StoreCategory {
    id: number;
    name: string;
    full_image_url: string | null;
    is_discount_category: boolean;
}

export interface StoreProduct {
    id: number;
    name: string;
    full_image_url: string;
    price: number;
    discounted_price: number | null;
    discount_percentage: number | null;
}

export interface SubCategory {
    id: number;
    name: string;
    products: StoreProduct[];
    total_products: number;
    has_more: boolean;
}

export interface CategoryDetail {
    category_id: number | string;
    category_name: string;
    is_discount_category: boolean;
    sub_categories: SubCategory[];
}

export interface StoreDetails {
    store_name: string;
    store_description: string;
    rating: number;
    free_delivery: boolean;
    delivery_time: string | null;
    store_image_url: string | null;
    store_logo_url: string | null;
    categories: StoreCategory[];
}

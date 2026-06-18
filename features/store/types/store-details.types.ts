import { StoreCategory } from "@/features/store/types/store-categories.types";

export interface Product {
    id: number;
    name: string;
    full_image_url: string;
    price: number;
}

export interface DiscountedProduct {
    id: number;
    name: string;
    full_image_url: string;
    original_price: number;
    discounted_price: number;
}

export interface FeaturedStoreDiscounted {
    store_id: number;
    logo_url: string;
    slogan: string;
    products: DiscountedProduct[];
}

export interface FeaturedStoreProducts {
    store_id: number;
    logo_url: string;
    slogan: string;
    products: Product[];
}
export interface CategoryProducts {

    category_id: number;
    category_name: string;
    products: Product[];
}

export interface StoreDetails {
    store_name: string;
    store_description: string;
    rating: number;
    free_delivery: boolean;
    delivery_time: string | null;
    store_image_url: string;
    store_logo_url: string;
    categories: StoreCategory[];
    category_products: CategoryProducts;
    featured_store_discounted: FeaturedStoreDiscounted | null;
    featured_store_products: FeaturedStoreProducts | null;
}

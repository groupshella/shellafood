export interface CategoryProduct {
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
    products: CategoryProduct[];
    total_products: number;
    has_more: boolean;
}

export interface CategoryDetails {
    category_id: string | number;
    category_name: string;
    is_discount_category: boolean;
    sub_categories: SubCategory[];
}

export interface StoreCategory {
    id: number;
    name: string;
    full_image_url: string | null;
    image_full_url?: string | null;
    is_discount_category?: boolean;
}

export interface StoreProduct {
    id: number;
    name: string;
    full_image_url: string;
    image_full_url?: string;
    price: number;
    discounted_price?: number | null;
    discount_percentage?: number | null;
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

/** Default category products embedded in store details. */
export interface StoreCategoryProducts {
    category_id: number;
    category_name: string;
    products: StoreProduct[];
}

export interface StoreDetails {
    store_id?: number;
    store_name: string;
    store_description: string;
    rating: number;
    free_delivery: boolean;
    delivery_time: string | null;
    store_image_url: string | null;
    store_logo_url: string | null;
    categories: StoreCategory[];
    category_products?: StoreCategoryProducts;
}

/** Prefer the API's default category_products id, otherwise the first category. */
export function resolveStoreCategoryId(
    store: StoreDetails,
    activeCategoryId?: string
): string {
    if (activeCategoryId) return activeCategoryId;
    if (store.category_products?.category_id != null) {
        return String(store.category_products.category_id);
    }
    if (store.categories[0]) return String(store.categories[0].id);
    return "";
}

/** Map embedded store `category_products` into the CategoryDetail shape used by the UI. */
export function categoryProductsToDetail(
    categoryProducts: StoreCategoryProducts
): CategoryDetail {
    const products = categoryProducts.products.map((product) => ({
        ...product,
        full_image_url: product.full_image_url || product.image_full_url || "",
        discounted_price: product.discounted_price ?? null,
        discount_percentage: product.discount_percentage ?? null,
    }));

    return {
        category_id: categoryProducts.category_id,
        category_name: categoryProducts.category_name,
        is_discount_category: false,
        sub_categories: [
            {
                id: categoryProducts.category_id,
                name: categoryProducts.category_name,
                products,
                total_products: products.length,
                has_more: false,
            },
        ],
    };
}

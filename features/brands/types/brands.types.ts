// ─── Brand (list) ─────────────────────────────────────────────────────────────

export interface Brand {
    id: number;
    name: string;
    image_full_url: string;
}

export type GetBrandsResponse = Brand[];

// ─── Raw item from GET /api/v1/items/search ───────────────────────────────────

export interface ItemSearchRawItem {
    id: number;
    name: string;
    description: string | null;
    image_full_url: string;
    price: number;
    discounted_price: number;
    original_price: number;
    discount: number;
    discount_type: "percent" | "amount" | string;
    status: number;
    unit_type: string | null;
    can_add_directly?: boolean;
    maximum_cart_quantity?: number | null;
    availability?: {
        is_available: boolean;
        stock_status: "in_stock" | "out_of_stock" | string;
    };
    in_stock?: boolean;
}

/** Envelope for GET /api/v1/items/search */
export interface ItemsSearchApiResponse {
    products_count: number;
    limit: number;
    page: number;
    page_products_count: number;
    products: ItemSearchRawItem[];
}

// ─── Normalised UI type (unchanged) ───────────────────────────────────────────

export interface BrandItem {
    id: number;
    name: string;
    description?: string;
    image_full_url: string;
    price: number;
    discounted_price: number;
    discount_percentage: number;
    available?: boolean;
}

// ─── Legacy alias kept for BFF routes that still use the old shape ─────────────
/** @deprecated Use ItemsSearchApiResponse */
export type GetBrandItemsApiResponse = ItemsSearchApiResponse;

// ─── Filter state ─────────────────────────────────────────────────────────────

export interface PriceRange {
    id: string;
    label: string;
    min: number;
    max?: number;
}

export interface FilterState {
    priceRange: PriceRange | null;
}

export const EMPTY_FILTER: FilterState = {
    priceRange: null,
};

export const PRICE_RANGES: PriceRange[] = [
    { id: "0-100", label: "0 - 100", min: 0, max: 100 },
    { id: "100-200", label: "100 - 200", min: 100, max: 200 },
    { id: "200-300", label: "200 - 300", min: 200, max: 300 },
    { id: "300-500", label: "300 - 500", min: 300, max: 500 },
    { id: "500+", label: "500+", min: 500 },
];

// ─── Offer metadata (from GET /api/v1/offers/active) ─────────────────────────

export type OfferStatus = "active" | "inactive" | string;

export interface Offer {
    id: number;
    reference: string;
    name: string;
    start_date: string;
    end_date: string;
    discount_min: number;
    discount_max: number;
    banner: string;
    banner_full_url: string;
    module_id: number;
    zone_id: number | null;
    created_at: string;
    updated_at: string;
    items_count: number;
    active: boolean;
    status: OfferStatus;
}

export type GetOffersResponse =
    | { success: true; data: Offer[]; message?: string }
    | { success: false; message: string };

// ─── Offer item (raw API + normalised UI) ─────────────────────────────────────

/** Product shape from GET /api/v1/offers/{id}/newitems */
export interface OfferNewItemApiResponse {
    id: number;
    name: string;
    image_full_url: string;
    image_status?: string;
    price: number;
    original_price: number;
    discount: number;
    discount_type: "percent" | "amount" | string;
    avg_rating?: number;
    stock?: number;
    in_stock?: boolean;
}

/** Product shape from GET /api/v1/offers/{id}/search → data.items[] */
export interface OfferSearchItemApiResponse extends OfferNewItemApiResponse {
    description?: string | null;
    image?: string;
    discounted_price?: number;
    status?: number;
    unit_type?: string | null;
    availability?: {
        is_available: boolean;
        stock_status?: string;
    };
}

export type OfferItemApiResponse = OfferSearchItemApiResponse;

export interface OfferItem {
    id: number;
    name: string;
    description?: string;
    image_full_url: string;
    price: number;
    discounted_price: number;
    discount_percentage: number;
    available?: boolean;
}

/** GET /api/v1/offers/{id}/newitems — flat envelope */
export interface GetOfferNewItemsApiResponse {
    products_count: number;
    limit: number;
    offset: number;
    page_products_count: number;
    products: OfferNewItemApiResponse[];
}

/** GET /api/v1/offers/{id}/search — wrapped envelope */
export interface OfferSearchPagination {
    total: number;
    limit: string | number;
    offset: string | number;
    has_more: boolean;
    current_page?: number;
    total_pages?: number;
}

export interface GetOfferSearchApiResponse {
    success: boolean;
    message?: string;
    data: {
        offer?: { id: number; name: string; reference: string };
        search_params?: Record<string, unknown>;
        pagination: OfferSearchPagination;
        items: OfferSearchItemApiResponse[];
    };
}

export interface OfferItemsResult {
    items: OfferItem[];
    total: number;
    offset: number;
    limit: number;
    hasMore: boolean;
}

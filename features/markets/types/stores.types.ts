// ── Get Stores ────────────────────────────────────────────────────────────────

export interface Store {
    id: number;
    name: string;
    module_id: number;
    slug: string;
    description: string | null;
    logo_full_url: string;
    cover_photo_full_url: string;
    avg_rating: number;
    rating_count: number;
    delivery_time: string;
    free_delivery: boolean;
    minimum_shipping_charge: number;
    first_km_fee: number;
    per_km_shipping_charge: number;
    distance: number;
    is_open: boolean;
    has_offer: boolean;
}

export interface GetStoresResponse {
    total_size: number;
    limit: number;
    offset: number;
    stores: Store[];
}

// ── Store Filters ─────────────────────────────────────────────────────────────

export interface StoreFilters {
    /** Category ID from the module's category list */
    categoryId: number | null;
    /** Only stores with active offers/discounts */
    hasOffer: boolean;
    /** Only stores offering free delivery */
    freeDelivery: boolean;
    /** Only top-rated stores */
    topRated: boolean;
    /** Only stores currently open */
    openNow: boolean;
    /** Only stores with delivery within 30 minutes */
    under30Min: boolean;
}

export const DEFAULT_FILTERS: StoreFilters = {
    categoryId: null,
    hasOffer: false,
    freeDelivery: false,
    topRated: false,
    openNow: false,
    under30Min: false,
};

/** Returns true if any filter is active */
export function hasActiveFilters(f: StoreFilters): boolean {
    return (
        f.categoryId !== null ||
        f.hasOffer ||
        f.freeDelivery ||
        f.topRated ||
        f.openNow ||
        f.under30Min
    );
}

/** Count how many chip filters are active (excluding categoryId) */
export function countActiveChipFilters(f: StoreFilters): number {
    return [f.hasOffer, f.freeDelivery, f.topRated, f.openNow, f.under30Min].filter(Boolean)
        .length;
}

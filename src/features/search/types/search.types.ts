/**
 * Shared types for the Search feature.
 */

// ─── Filters ──────────────────────────────────────────────────────────────────

export type SortBy =
	| "popularity"
	| "price_low"
	| "price_high"
	| "rating"
	| "newest";

export type DietaryFilter =
	| "veg"
	| "non_veg"
	| "halal"
	| "organic"
	| "gluten_free"
	| "dairy_free"
	| "nut_free";

export interface PriceRange {
	min: number;
	max: number;
}

export interface SearchFilters {
	sortBy: SortBy | undefined;
	minRating: number | null;
	priceRange: PriceRange | null;
	dietary: DietaryFilter | undefined;
	availableNow: boolean;
	inStock: boolean;
	categories: string[];
}

// ─── API ─────────────────────────────────────────────────────────────────────

export interface SearchQuery {
	query: string;
	filters?: Partial<SearchFilters>;
}

export interface ApiResponse<T> {
	success: boolean;
	data?: T;
	error?: string;
}

/** `GET /api/v1/items/item-or-store-search` — item row */
export interface ItemOrStoreSearchItem {
	type: "item" | string;
	id: number;
	name: string;
	price?: number;
	image_full_url?: string;
	avg_rating?: number;
	rating_count?: number;
	store?: {
		id: number;
		name: string;
	};
}

/** `GET /api/v1/items/item-or-store-search` — store row */
export interface ItemOrStoreSearchStore {
	id: number;
	name: string;
	module_id?: number;
	logo_full_url?: string | null;
	cover_photo_full_url?: string | null;
	avg_rating?: number;
	rating_count?: number;
	delivery_time?: string | null;
	minimum_shipping_charge?: number;
	is_open?: boolean;
	open?: number;
	[key: string]: unknown;
}

export interface ItemOrStoreSearchResponse {
	items: ItemOrStoreSearchItem[];
	stores: ItemOrStoreSearchStore[];
}

export interface SearchResults {
	products: ItemOrStoreSearchItem[];
	stores: ItemOrStoreSearchStore[];
	total: number;
}

export interface SearchRequestContext {
	lang?: string;
	zoneId?: string;
	moduleId?: string;
	latitude?: string;
	longitude?: string;
}


export type StoreType = "all" | "veg" | "non_veg";

export interface StoreSearchParams {
	name: string;
	type?: StoreType;
	category_id?: number;
	limit?: number;
	offset?: number;
}



export type ApiResult =
	| { success: true; data: StoreSearchResponse }
	| { success: false; error: string };

// ─── Request context ──────────────────────────────────────────────────────────

export interface SearchContext {
	zoneId: string;
	moduleId?: string;
	longitude?: string;
	latitude?: string;
	lang?: string;
}
export interface StoreDelivery {
	delivery_available: boolean;
	delivery_time_range: string;
	minimum_delivery_time: number;
	maximum_delivery_time: number;
	delivery_fee: number;
	takeaway_available: boolean;
}

export interface ApiStore {
	id: number;
	name: string;
	slug: string;
	logo_full_url: string;
	cover_photo_full_url: string;
	avg_rating: number;
	rating_count: number;
	delivery: StoreDelivery;
	delivery_time: string;
	delivery_fee_display: string;
	delivery_fee_display_ar: string;
	minimum_order: number;
	distance_display: string;
	distance_display_ar: string;
	distance_meters: number;
	is_open: boolean;
	current_opening_time: string;
	category_display: string;
	category_display_ar: string;
	veg: 0 | 1;
	non_veg: 0 | 1;
	halal_tag_status: boolean;
	free_delivery: boolean;
	busy_mode: boolean;
	discount: unknown | null;
	discount_status: boolean;
	active: boolean;
}

export interface StoreSearchResponse {
	total_size: number;
	limit: number;
	offset: number;
	stores: ApiStore[];
}
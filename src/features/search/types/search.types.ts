/**
 * Search Feature Types
 * Type definitions for search-related entities
 */

export type SearchTab = "all" | "stores" | "products";

export interface SearchFilters {
	sortBy: "relevance" | "rating" | "price_low" | "price_high" | "distance";
	minRating: number | null;
	priceRange: { min: number; max: number } | null;
	categories: string[];
}

export interface SearchQuery {
	query: string;
	filters?: Partial<SearchFilters>;
}

export interface SearchResults {
	stores: Store[];
	products: Product[];
}

export interface Store {
	id: string;
	name: string;
	nameAr?: string;
	logo?: string;
	rating?: number;
	reviewsCount?: number;
	deliveryTime?: string;
	deliveryFee?: number;
	minimumOrder?: number;
	_searchType?: "store";
}

export interface Product {
	id: string;
	name: string;
	nameAr?: string;
	image?: string;
	price: number;
	originalPrice?: number;
	storeId?: string;
	storeName?: string;
	rating?: number;
	reviewsCount?: number;
	_searchType?: "product";
}

export interface ApiResponse<T> {
	success: boolean;
	data?: T;
	error?: string;
}


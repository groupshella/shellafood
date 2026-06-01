import { BASE_URL, DEFAULT_LANG } from "@/features/(actors)/auth/constants/auth.constants";
import { cache } from 'react';
import { Item } from '../types/department.types';

export interface SearchProduct {
	id: number;
	name: string;
	price: number;
	original_price: number;
	discount: number;
	discount_type: string;
	image_full_url: string;
	avg_rating: number;
	rating_count: number;
	in_stock: boolean;
	has_variations: boolean;
	has_add_ons: boolean;
	store: {
		id: number;
		name: string;
		logo: string;
	};
}

export interface SearchResponse {
	total_size: number;
	limit: string;
	offset: string;
	products: SearchProduct[];
}

export interface ApiResponse<T> {
	data?: T;
	error?: string;
	status?: number;
}

export const getCachedSearchProducts = cache(
	async (
		name: string,
		limit: number,
		offset: number,
		lang: string,
		moduleId: number,
		zoneId: number,
	) => {
		const result = await searchProducts(name, limit, offset, lang, moduleId, zoneId);
		return result;
	}
);

/**
 * Search products by name
 * @param name - Search query
 * @param limit - Number of products per page
 * @param offset - Page number (offset=1 means page 1)
 * @param lang - Language code ('ar' or 'en')
 * @param moduleId - Module ID
 * @param zoneId - Zone ID
 */
export async function searchProducts(
	name: string,
	limit: number = 20,
	offset: number = 1,
	lang: string = DEFAULT_LANG,
	moduleId: number,
	zoneId: number,
): Promise<ApiResponse<SearchResponse>> {
	try {
		const cacheTag = `search-${name}-${limit}-${offset}-${moduleId}-${zoneId}-${lang}`;
		const url = `${BASE_URL}/api/v1/items/search?name=${encodeURIComponent(name)}&limit=${limit}&offset=${offset}`;

		console.log(`[Search API] Requesting: ${url}`);
		console.log(`[Search API] Cache config:`, {
			revalidate: 300,
			tags: [cacheTag],
			lang,
		});

		const fetchStartTime = Date.now();

		const response = await fetch(url, {
			method: 'GET',
			headers: {
				'Accept': 'application/json',
				'X-localization': lang,
				'moduleId': moduleId.toString(),
				'zoneId': "[2]",
				'X-Response-Mode': 'minimal',
			},
			cache: 'no-store',
		});

		const fetchDuration = Date.now() - fetchStartTime;

		const cacheStatus = response.headers.get('x-vercel-cache') ||
			response.headers.get('cache-control') ||
			'unknown';

		console.log(`[Search API] Response received in ${fetchDuration}ms:`, {
			status: response.status,
			statusText: response.statusText,
			cacheStatus,
		});
		if (!response.ok) {
			const errorData = await response.json().catch(() => ({
				message: 'Failed to search products',
			}));
			console.error('[Search API] API Error:', {
				status: response.status,
				message: errorData.message,
			});
			return {
				error: errorData.message || 'Failed to search products',
				status: response.status,
			};
		}

		const data = await response.json();

		console.log(`[Search API] Data parsed:`, {
			totalSize: data.total_size,
			productsCount: data.products?.length || 0,
		});

		return {
			data: {
				total_size: data.total_size || 0,
				limit: data.limit || limit.toString(),
				offset: data.offset || offset.toString(),
				products: data.products || [],
			},
		};
	} catch (error) {
		console.log('[Search API] Network Error:', error);
		return {
			error: 'Network error',
			status: 500,
		};
	}
}

/**
 * Transform search product to Item format
 */
export function transformSearchProductToItem(product: SearchProduct): Item {
	return {
		id: product.id,
		name: product.name,
		description: '',
		image: product.image_full_url,
		image_full_url: product.image_full_url,
		images_full_url: [product.image_full_url],
		category_id: 0,
		brand_id: 0,
		category_ids: [],
		variations: [],
		add_ons: [],
		attributes: [],
		choice_options: [],
		p_margin: 0,
		price: product.price,
		original_price: product.original_price,
		cat_exclude: false,
		store_exclude: false,
		tax: 0,
		tax_class_id: null,
		profit_class_id: null,
		tax_cal: '',
		tax_type: '',
		discount: product.discount,
		discount_type: product.discount_type,
		available_time_starts: '',
		available_time_ends: '',
		veg: 0,
		status: 1,
		store_id: product.store.id,
		store_name: product.store.name,
		created_at: '',
		updated_at: '',
		order_count: 0,
		avg_rating: product.avg_rating,
		rating_count: product.rating_count,
		module_id: 0,
		item_site_id: '',
		stock: product.in_stock ? 1 : 0,
		unit_id: 0,
		images: [],
		food_variations: [],
		slug: '',
		recommended: 0,
		organic: 0,
		maximum_cart_quantity: 0,
		is_approved: 1,
		is_halal: 0,
		item_code: '',
		store_site_id: '',
		requires_customization: product.has_variations || product.has_add_ons,
		can_add_directly: !product.has_variations && !product.has_add_ons,
		presets: [],
		module_type: '',
		is_campaign: 0,
		zone_id: 0,
		flash_sale: 0,
		store_discount: 0,
		schedule_order: false,
		delivery_time: '',
		free_delivery: false,
		unit: {
			id: 0,
			unit: '',
			created_at: '',
			updated_at: '',
			translations: [],
		},
		min_delivery_time: 0,
		max_delivery_time: 0,
		common_condition_id: 0,
		is_basic: 0,
		is_prescription_required: 0,
		halal_tag_status: 0,
		highest_price_store_id: 0,
		highest_price_store_name: '',
		highest_price: 0,
		cheapest_available_store_id: 0,
		cheapest_available_store_name: '',
		cheapest_available_price: 0,
		delivery_store_id: 0,
		total_available_stores: 0,
		has_multiple_stores: false,
		nutritions_name: [],
		allergies_name: [],
		generic_name: [],
		allergens: [],
		allergen_free: false,
		contains_nuts: false,
		contains_gluten: false,
		contains_dairy: false,
		contains_eggs: false,
		dietary: {
			is_vegetarian: false,
			is_vegan: false,
			is_halal: false,
			is_organic: false,
			is_gluten_free: false,
			is_dairy_free: false,
			is_nut_free: false,
			is_sugar_free: false,
			is_low_carb: false,
			is_keto: false,
			is_paleo: false,
		},
		tags: [],
		availability: {
			is_available: product.in_stock,
			is_available_now: product.in_stock,
			available_quantity: product.in_stock ? 1 : 0,
			stock_status: product.in_stock ? 'in_stock' : 'out_of_stock',
			estimated_preparation_time: '',
			unavailable_until: null,
			available_time_starts: '',
			available_time_ends: '',
			available_days: [],
			next_available_time: null,
			seasonal: false,
			season_start: null,
			season_end: null,
		},
		unit_type: '',
		discounted_price: product.price,
		storage: [],
		translations: [],
		module: null,
		ecommerce_item_details: null,
		item_nutrition_value: null,
		allergies: [],
	};
}


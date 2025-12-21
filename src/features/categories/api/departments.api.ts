import { BASE_URL, DEFAULT_LANG } from "@/features/auth/constants/auth.constants";
import { cache } from 'react';

export interface DepartmentItem {
	id: number;
	name: string;
	name_ar: string;
	image: string;
	position: number;
	parent_id: number;
	items_count: number;
}

export interface DepartmentsResponse {
	store_id: number;
	store_name: string;
	categories: DepartmentItem[];
	total_categories: number;
	limit: number;
	offset: number;
	has_more: boolean;
}

export interface ApiResponse<T> {
	data?: T;
	error?: string;	
	status?: number;
}

export const getCachedDepartments = cache(
	async (
		storeId: number,
		limit: number,
		offset: number,	
		lang: string,
		moduleId: number,
		zoneId: number,
		
	) => {
		const result = await getDepartments(storeId, limit, offset, lang, moduleId, zoneId);
		return result;
	}
);

/**
 * Fetch departments for a specific store with pagination
 * @param storeId - Store ID
 * @param limit - Number of departments per page
 * @param offset - Page number (offset=1 means page 1)
 * @param lang - Language code ('ar' or 'en')
 */
export async function getDepartments(
	storeId: number,
	limit: number = 20,
	offset: number = 1,	
	lang: string = DEFAULT_LANG,
	moduleId: number,
	zoneId: number,
	
): Promise<ApiResponse<DepartmentsResponse>> {
	try {
		const cacheTag = `departments-store-${storeId}-${limit}-${offset}-${moduleId}-${zoneId}-${storeId}`;
		const url = `http://shellafood.com/api/v1/stores/${storeId}/categories?limit=${limit}&offset=${offset}`;
		
		console.log(`[Departments API] Requesting: ${url}`);
		console.log(`[Departments API] Cache config:`, {
			revalidate: 600,
			tags: [cacheTag],
			lang,
		});
		
		const fetchStartTime = Date.now();
		
		const response = await fetch(url, {
			method: 'GET',
			headers: {
				'Accept': 'application/json',
				'X-localization': lang,
				"moduleId": moduleId.toString(),
				"zoneId": "[2]"
			},
			next: {
				revalidate: 12000, // Re-fetch every 10 minutes
				tags: [cacheTag],
			},
		});
		
		const fetchDuration = Date.now() - fetchStartTime;
		
		const cacheStatus = response.headers.get('x-vercel-cache') || 
		                   response.headers.get('cache-control') || 
		                   'unknown';
		
		console.log(`[Departments API] Response received in ${fetchDuration}ms:`, {
			status: response.status,
			statusText: response.statusText,
			cacheStatus,
		});
		
		if (!response.ok) {
			const errorData = await response.json().catch(() => ({
				message: 'Failed to fetch departments',
			}));
			console.error('[Departments API] API Error:', {
				status: response.status,
				message: errorData.message,
			});
			return {
				error: errorData.message || 'Failed to fetch departments',
				status: response.status,
			};
		}
		
		const data = await response.json();
		
		console.log(`[Departments API] Data parsed:`, {
			storeId: data.store_id,
			categoriesCount: data.categories?.length || 0,
			totalCategories: data.total_categories,
			hasMore: data.has_more,
		});

		return {
			data: {
				store_id: data.store_id,
				store_name: data.store_name,
				categories: data.categories || [],
				total_categories: data.total_categories || 0,
				limit: data.limit || limit,
				offset: data.offset || offset,
				has_more: data.has_more || false,
			},
		};
	} catch (error) {
		console.error('[Departments API] Network Error:', error);
		return {
			error: 'Network error',
			status: 500,
		};
	}
}


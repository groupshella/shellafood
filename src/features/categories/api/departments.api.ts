import { DEFAULT_LANG } from "@/features/auth/constants/auth.constants";
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
	/** Present when Laravel pagination query params were sent */
	limit?: number;
	offset?: number;
	has_more?: boolean;
}

export interface ApiResponse<T> {
	data?: T;
	error?: string;
	status?: number;
}

/**
 * Laravel `zoneId` header: JSON array string for json_decode(), e.g. `[2]`.
 */
export function zoneIdHeaderValue(zoneId: number | number[]): string {
	const ids = Array.isArray(zoneId) ? zoneId : [zoneId];
	return JSON.stringify(ids);
}

function laravelErrorMessage(body: unknown): string {
	if (!body || typeof body !== 'object') return 'Failed to fetch departments';
	const o = body as Record<string, unknown>;
	if (typeof o.message === 'string' && o.message) return o.message;
	const errors = o.errors;
	if (Array.isArray(errors) && errors.length > 0) {
		const first = errors[0] as Record<string, unknown>;
		if (typeof first?.message === 'string') return first.message;
	}
	return 'Failed to fetch departments';
}

export async function getDepartments(
	storeId: number,
	limit: number = 20,
	offset: number = 1,
	lang: string = DEFAULT_LANG,
	moduleId: number,
	zoneId: number,

): Promise<ApiResponse<DepartmentsResponse>> {
	try {
		if (!moduleId || moduleId <= 0 || !zoneId || zoneId <= 0) {
			return { error: 'Invalid moduleId or zoneId', status: 400 };
		}

		const url = `https://shellafood.com/api/v1/stores/${storeId}/categories?limit=${limit}&offset=${offset}`;

		console.log(`[Departments API] Requesting: ${url}`, {
			moduleId,
			zoneIdHeader: zoneIdHeaderValue(zoneId),
		});

		const fetchStartTime = Date.now();

		const response = await fetch(url, {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				'X-localization': lang,
				moduleId: String(moduleId),
				zoneId: zoneIdHeaderValue(zoneId),
				'User-Agent': 'ShellaFood-WebApp/1.0',
			},
			cache: 'no-store',
		});

		const fetchDuration = Date.now() - fetchStartTime;

		console.log(`[Departments API] Response received in ${fetchDuration}ms:`, {
			status: response.status,
			statusText: response.statusText,
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}));
			const message = laravelErrorMessage(errorData);
			console.error('[Departments API] API Error:', {
				status: response.status,
				message,
				body: errorData,
			});
			return {
				error: message,
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
				total_categories: data.total_categories ?? 0,
				limit: data.limit,
				offset: data.offset,
				has_more: data.has_more ?? false,
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

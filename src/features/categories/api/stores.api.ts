import { DEFAULT_LANG } from "@/features/auth/constants/auth.constants";
import { Store, StoreList } from "../types/store.types";
import { sessionCache } from "@/lib/cache/session-cache";
import type { StoreDetails } from "../types/store.details.types";
import { DepartmentResponse } from "../types/department.types";
import { cache } from "react";
import { cookies } from "next/headers";
interface ApiResponse<T> {
	data?: T;
	error?: string;
	status: number;
}

export const getCachedAllStores = cache(
	async (
		limit: number = 12,
		offset: number = 1,
		lang: string = DEFAULT_LANG,
		moduleId: number,
		zoneId: number,
		longitude: string,
		latitude: string,
	) => {

		const result = await getAllStores(limit, offset, lang, moduleId, zoneId, longitude, latitude);
		return result;
	}
);
/**
 * Get all stores with session storage caching
 */
export async function getAllStores(
	limit: number = 12,
	offset: number = 1,
	lang: string = DEFAULT_LANG,
	moduleId: number,
	zoneId: number,
	longitude: string,
	latitude: string,
): Promise<ApiResponse<StoreList>> {

	const cacheTag = `stores-${moduleId}-${zoneId}-${lang}-${limit}-${offset}`;
	const url = `https://shellafood.com/api/v1/stores/get-stores?limit=${limit}&offset=${offset}`;



	try {

		const fetchStartTime = Date.now();
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 10000);
		const response = await fetch(url, {
			method: 'GET',
			headers: {
				'Accept': 'application/json',
				'X-localization': lang,
				'moduleId': moduleId.toString(),
				'zoneId': "[2]",
				'longitude': longitude,
				'latitude': latitude,
				'User-Agent':
					'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
			},
			signal: controller.signal,
		});

		clearTimeout(timeoutId);




		if (!response.ok) {
			let errorData;
			const responseText = await response.text();

			try {
				errorData = JSON.parse(responseText);
			} catch (e) {
				errorData = { message: responseText || 'Failed to fetch stores' };
			}

			// 20.699283416336305,47.59962532951791

			return {
				error: errorData.message || 'Failed to fetch stores',
				status: response.status,
			};
		}

		const data = await response.json() as StoreList;
		return {
			data,
			status: response.status,
		};

	} catch (error: any) {

		return {
			error: `Network error: ${error?.message || 'Unknown'}`,
			status: 500,
		};
	}
}




export const getCachedStoreDetails = cache(
	async (
		limit: number = 12,
		offset: number = 1,
		lang: string = DEFAULT_LANG,
		moduleId: number,
		zoneId: number,
		storeId: number,
		longitude: string,
		latitude: string,
	) => {
		const result = await getStoreDetails(limit, offset, moduleId, zoneId, storeId, lang, longitude, latitude);
		return result;
	}
);

export async function getStoreDetails(
	limit: number = 12,
	offset: number = 1,
	moduleId: number,
	zoneId: number,
	storeId: number,
	lang: string = DEFAULT_LANG,
	longitude: string,
	latitude: string,
): Promise<ApiResponse<StoreDetails>> {

	const cacheTag = `store-details-${moduleId}-${zoneId}-${storeId}-${lang}-${limit}-${offset}`;
	const url = `https://shellafood.com/api/v1/stores/details/${storeId}?limit=${limit}&offset=${offset}&include_categories=1`;

	try {


		const response = await fetch(url, {
			method: 'GET',
			headers: {
				'Accept': 'application/json',
				'X-Localization': lang,
				'moduleId': moduleId.toString(),
				'zoneId': "[2]",
				'longitude': longitude,
				'latitude': latitude,

			},
			cache: 'no-store',
		});


		if (!response.ok) {
			const errorData = await response.json().catch(() => ({
				message: 'Failed to fetch store details',
			}));

			console.error('[Next.js Fetch Cache] API Error:', {
				status: response.status,
				message: errorData.message,
			});

			return {
				error: errorData.message || 'Failed to fetch store details',
				status: response.status,
			};
		}

		const data = await response.json() as StoreDetails;

		console.log('[Next.js Fetch Cache] Data parsed:', {
			data: data,
			hasStore: !!data?.id,
			storeId: data?.id,
		});

		return {
			data,
			status: response.status,
		};

	} catch (error) {
		console.error('[Next.js Fetch Cache] Network Error:', error);

		return {
			error: 'Network error',
			status: 500,
		};
	}
}





export async function getDepartments(
	limit: number = 12,
	offset: number = 1,
	moduleId: number,
	storeId: number,
	departmentId: number,
	zoneId: number,
	lang: string = DEFAULT_LANG,
): Promise<ApiResponse<DepartmentResponse>> {

	return {
		data: {
			products: [],
			total_size: 0,
			offset: "1",
			limit: 12,
			has_more: false,
		},
		status: 200,
	};

}
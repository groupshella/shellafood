import { BASE_URL, DEFAULT_LANG } from "@/features/auth/constants/auth.constants";
import { Store, StoreList } from "../types/store.types";
import { sessionCache } from "@/lib/cache/session-cache";
import type { StoreDetails } from "../types/store.details.types";
import { DepartmentResponse } from "../types/department.types";
import type { Product } from "../types/product.types";
import { cache } from "react";

interface ApiResponse<T> {
	data?: T;
	error?: string;
	status: number;
}
export const getCachedProductDetails = cache(
	async (
		moduleId: number,
		storeId: number,
		categoryId: number,
		productId: number,
		zoneId: number,
		lang: string = DEFAULT_LANG,
	) => {
		const result = await getProductDetails(moduleId, storeId, categoryId, productId, zoneId, lang);
		return result;
	}
);

export async function getProductDetails(
	moduleId: number,
	storeId: number,
	categoryId: number,
	productId: number,
	zoneId: number,
	lang: string = DEFAULT_LANG,
): Promise<ApiResponse<Product>> {

	const cacheTag = `product-details-${moduleId}-${storeId}-${categoryId}-${productId}-${zoneId}-${lang}`;
	const url = `${BASE_URL}/api/v1/items/details/${productId}?store_id=${storeId}&category_id=${categoryId}`;

	try {


		const fetchStartTime = Date.now();

		const response = await fetch(url, {
			method: 'GET',
			headers: {
				'Accept': 'application/json',
				'X-localization': lang,
				'moduleId': moduleId.toString(),
				'zoneId': `[${zoneId}]`, // API expects array format "[2]"
			},
			cache: 'no-store',
		});

		const fetchDuration = Date.now() - fetchStartTime;

		const cacheStatus =
			response.headers.get('x-vercel-cache') ||
			response.headers.get('cache-control') ||
			'unknown';

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({
				message: 'Failed to fetch product details',
			}));

			return {
				error: errorData.message || 'Failed to fetch product details',
				status: response.status,
			};
		}

		const data = await response.json() as Product;

		return {
			data,
			status: response.status,
		};

	} catch (error) {
		return {
			error: 'Network error',
			status: 500,
		};
	}
}

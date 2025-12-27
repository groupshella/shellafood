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
		productId: number,
		zoneId: number,
		lang: string = DEFAULT_LANG,
	) => {
		const result = await getProductDetails(moduleId, productId, zoneId, lang);
		return result;
	}
);

export async function getProductDetails(
	moduleId: number,
	productId: number,
	zoneId: number,
	lang: string = DEFAULT_LANG,
  ): Promise<ApiResponse<Product>> {
  
	const cacheTag = `product-details-${moduleId}-${productId}-${zoneId}-${lang}`;
	const url = `${BASE_URL}/api/v1/items/details/${productId}`;
  
	try {
	  console.log(`[Next.js Fetch Cache] Requesting: ${url}`);
	  console.log(`[Next.js Fetch Cache] Cache config:`, {
		revalidate: 3600,
		tags: [cacheTag],
		moduleId,
		productId,
		zoneId,
		lang,
	  });
  
	  const fetchStartTime = Date.now();
  
	  const response = await fetch(url, {
		method: 'GET',
		headers: {
		  'Accept': 'application/json',
		  'Content-Type': 'application/json',
		  'X-localization': lang, 
		  'moduleId': moduleId.toString(),
		  'zoneId': `[${zoneId}]`, // API expects array format "[2]"
		  'User-Agent': 'ShellaFood-WebApp/1.0',
		  'Origin': 'https://shellafood.com',
		  'Referer': 'https://shellafood.com/',
		},
		// ✅ Next.js built-in cache
		next: {
		  revalidate: 3600, // 1 hour
		  tags: [cacheTag],
		},
	  });
  
	  const fetchDuration = Date.now() - fetchStartTime;
  
	  const cacheStatus =
		response.headers.get('x-vercel-cache') ||
		response.headers.get('cache-control') ||
		'unknown';
  
	  console.log(`[Next.js Fetch Cache] Response received in ${fetchDuration}ms:`, {
		status: response.status,
		cacheStatus,
		url: response.url,
	  });
  
	  if (!response.ok) {
		const errorData = await response.json().catch(() => ({
		  message: 'Failed to fetch product details',
		}));
  
		console.error('[Next.js Fetch Cache] API Error:', {
		  status: response.status,
		  message: errorData.message,
		});
  
		return {
		  error: errorData.message || 'Failed to fetch product details',
		  status: response.status,
		};
	  }
  
	  const data = await response.json() as Product;
  
	  console.log('[Next.js Fetch Cache] Data parsed:', {
		productId: data?.id,
		hasImages: (data?.images_full_url?.length ?? 0) > 0,
		price: data?.price,
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
  
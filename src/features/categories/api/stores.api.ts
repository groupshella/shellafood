import { DEFAULT_LANG } from "@/features/auth/constants/auth.constants";
import { Store, StoreList } from "../types/store.types";
import { sessionCache } from "@/lib/cache/session-cache";
import type { StoreDetails } from "../types/store.details.types";
import { DepartmentResponse } from "../types/department.types";
import { cache } from "react";

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
	) => {
		const result = await getAllStores(limit, offset, lang, moduleId, zoneId);
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
): Promise<ApiResponse<StoreList>> {

  const cacheTag = `stores-${moduleId}-${zoneId}-${lang}-${limit}-${offset}`;
  const url = `https://shellafood.com/api/v1/stores/get-stores/all?limit=${limit}&offset=${offset}`;

  try {
    console.log(`[getAllStores] Starting request:`, {
      url,
      cacheTag,
      params: { limit, offset, lang, moduleId, zoneId },
    });

    const fetchStartTime = Date.now();
	const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.  abort(), 10000);
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
		'x-localization': lang,
        'moduleId': moduleId.toString(),
        'zoneId': zoneId.toString(),
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36',
      },
	  signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const fetchDuration = Date.now() - fetchStartTime;

    const cacheStatus =
      response.headers.get('x-vercel-cache') ||
      response.headers.get('cache-control') ||
      'unknown';

    console.log(`[getAllStores] Response received in ${fetchDuration}ms:`, {
      status: response.status,
      statusText: response.statusText,
      cacheStatus,
      url: response.url,
      headers: Object.fromEntries(response.headers.entries()),
    });

    if (!response.ok) {
      let errorData;
      const responseText = await response.text();
      console.log(`[getAllStores] Error response body (raw):`, responseText);
      
      try {
        errorData = JSON.parse(responseText);
      } catch (e) {
        errorData = { message: responseText || 'Failed to fetch stores' };
      }

      console.error('[getAllStores] API Error:', {
        status: response.status,
        statusText: response.statusText,
        message: errorData.message,
        fullError: errorData,
        requestParams: { limit, offset, lang, moduleId, zoneId },
      });

      return {
        error: errorData.message || 'Failed to fetch stores',
        status: response.status,
      };
    }

    const data = await response.json() as StoreList;

    console.log(`[getAllStores] Data parsed successfully:`, {
      storesCount: data?.stores?.length ?? 0,
      totalSize: data?.total_size,
      hasMore: data?.total_size > limit * offset,
      firstStore: data?.stores?.[0]?.name || 'N/A',
    });

    return {
      data,
      status: response.status,
    };

  } catch (error: any) {
    console.error('[getAllStores] Network/Parse Error:', {
      message: error?.message,
      stack: error?.stack,
      name: error?.name,
      cause: error?.cause,
      requestParams: { limit, offset, lang, moduleId, zoneId },
    });

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
	  console.log(`[Next.js Fetch Cache] Requesting: ${url}`);
	  console.log(`[Next.js Fetch Cache] Cache config:`, {
		revalidate: 3600,
		tags: [cacheTag],
		lang,
		storeId,
		moduleId,
		zoneId,
		limit,
		offset,
	  });
  
	  const fetchStartTime = Date.now();
  console.log("longitude", longitude);
  console.log("latitude", latitude);
  console.log("moduleId", moduleId);
  
	  const response = await fetch(url, {
		method: 'GET',
		headers: {
		  'Accept': 'application/json',
		  'X-Localization': lang,
		  'moduleId': moduleId.toString(),
		  'zoneId': "[2]",
		  'longitude': "46.5995713",
		  'latitude': "24.6100271",
		 
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
		data:data,
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
  



  export const getCachedDepartments = cache(
	async (
		limit: number = 12,
		offset: number = 1,
		lang: string = DEFAULT_LANG,
		moduleId: number,
		zoneId: number,
		storeId: number,
		departmentId: number,
	) => {
		const result = await getDepartments(limit, offset, moduleId, storeId, departmentId, zoneId, lang);
		return result;
	}
);
  export async function getDepartments(
	limit: number = 12,
	offset: number = 1,
	moduleId: number,
	storeId: number,
	departmentId: number,
	zoneId: number,
	lang: string = DEFAULT_LANG,
  ): Promise<ApiResponse<DepartmentResponse>> {
  
	const cacheTag = `departments-${moduleId}-${storeId}-${departmentId}-${zoneId}-${lang}-${limit}-${offset}`;
	const url = `https://shellafood.com/api/v1/stores/${storeId}/categories/${departmentId}/items?limit=${limit}&offset=${offset}&type=all`;
  
	try {
	  console.log(`[Next.js Fetch Cache] Requesting: ${url}`);
	  console.log(`[Next.js Fetch Cache] Cache config:`, {
		revalidate: 3600,
		tags: [cacheTag],
		moduleId,
		storeId,
		departmentId,
		zoneId,
		lang,
		limit,
		offset,
	  });
  
	  const fetchStartTime = Date.now();
  
	  const response = await fetch(url, {
		method: 'GET',
		headers: {
		  'Accept': 'application/json',
		  'X-Localization': lang,
		  'moduleId': moduleId.toString(),
		  'zoneId': "[2]",
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
		  message: 'Failed to fetch departments',
		}));
  
		console.error('[Next.js Fetch Cache] API Error:', {
		  status: response.status,
		  message: errorData.message,
		});
  
		return {
		  error: errorData.message || 'Failed to fetch departments',
		  status: response.status,
		};
	  }
  
	  const data = await response.json() as DepartmentResponse;
  
	  console.log('[Next.js Fetch Cache] Data parsed:', {
		itemsCount: data?.items?.length ?? 0,
		departmentId,
		storeId,
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
  
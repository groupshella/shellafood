import { BASE_URL, DEFAULT_LANG } from "@/features/auth/constants/auth.constants";
import { cache } from 'react';

import {  ZoneData } from "../types/module.types";


export const getCachedZoneData = cache(
	async (latitude: number, longitude: number, lang: string) => {
		const result = await getZoneDataFromLocation(latitude, longitude, lang);
		return result;
	}
);

/**
 * ✅ Server-side function with Next.js cache
 * Use this function in Server Components, Server Actions, or Route Handlers
 * 
 * @param latitude - User's latitude coordinate
 * @param longitude - User's longitude coordinate
 * @param lang - Language code ('ar' or 'en'), defaults to 'en'
 * @returns ZoneData object or null on error
 * 
 * @example
 * // In a Server Component
 * const zoneData = await getZoneDataFromLocation(24.54, 46.50, 'ar');
 * 
 * @example
 * // In a Server Action
 * 'use server'
 * export async function getModulesForLocation(lat: number, lng: number) {
 add*   const zoneData = await getZoneDataFromLocation(lat, lng);
 *   return zoneData?.zone_data?.[0]?.modules || [];
 * }
 */
export async function getZoneDataFromLocation(
	latitude: number,
	longitude: number,
	lang: string = DEFAULT_LANG
): Promise<ZoneData | null> {
	try {
		const cacheTag = `zone-${latitude.toFixed(4)}-${longitude.toFixed(4)}`;
		const url = `${BASE_URL}/api/v1/config/get-zone-id?latitude=${latitude}&longitude=${longitude}`;
		
		console.log(`[Next.js Fetch Cache] Requesting: ${url}`);
		console.log(`[Next.js Fetch Cache] Cache config:`, {
			revalidate: 3600,
			tags: [cacheTag],
			lang,
		});
		
		const fetchStartTime = Date.now();
		
		const response = await fetch(url, {
			method: 'GET',
			headers: {
				'Accept': 'application/json',
				'X-localization': lang,
			},
			// ✅ Next.js built-in cache (shared across all requests)
			next: {
				revalidate: 3600, // Re-fetch every 1 hour
				tags: [cacheTag], // For on-demand revalidation
			},
		});
		
		const fetchDuration = Date.now() - fetchStartTime;
		
		// Check cache headers if available
		const cacheStatus = response.headers.get('x-vercel-cache') || 
		                   response.headers.get('cache-control') || 
		                   'unknown';
		
		console.log(`[Next.js Fetch Cache] Response received in ${fetchDuration}ms:`, {
			status: response.status,
			statusText: response.statusText,
			cacheStatus,
			url: response.url,
		});
		
		if (!response.ok) {
			console.error('[Next.js Fetch Cache] API Error:', response.status);
			return null;
		}
		
		const data = await response.json();
		
		console.log(`[Next.js Fetch Cache] Data parsed:`, {
			hasZoneId: !!data.zone_id,
			zoneDataLength: data.zone_data?.length || 0,
			modulesCount: data.zone_data?.[0]?.modules?.length || 0,
		});

		return {
			zone_id: data.zone_id,
			zone_data: data.zone_data || [],
		};
	} catch (error) {
		console.error('[Next.js Fetch Cache] Network Error:', error);
		return null;
	}
}
  
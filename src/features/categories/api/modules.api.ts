import { DEFAULT_LANG } from "@/features/auth/constants/auth.constants";
import { cache } from 'react';
import { headers } from 'next/headers';

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
		// ✅ Use your own API route as proxy instead of direct external call
		// Construct absolute URL for server-side fetch
		const headersList = await headers();
		const host = headersList.get('host') || 'localhost:3000';
		const protocol = process.env.NODE_ENV === 'production' 
			? 'https' 
			: (host.includes('localhost') ? 'http' : 'https');
		
		const url = `${protocol}://${host}/api/modules?latitude=${latitude}&longitude=${longitude}&lang=${lang}`;
		const cacheTag = `zone-${latitude.toFixed(4)}-${longitude.toFixed(4)}`;
		
		if (process.env.NODE_ENV === 'development') {
			console.log('[Zone API] Requesting via proxy:', url);
		}
		
		const response = await fetch(url, {
			method: 'GET',
			headers: {
				'Accept': 'application/json',
			},
			// ✅ Next.js built-in cache (shared across all requests)
			next: {
				revalidate: 3600, // Re-fetch every 1 hour
				tags: [cacheTag], // For on-demand revalidation
			},
		});
		
		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}));
			console.error('[Zone API] Proxy error:', {
				status: response.status,
				statusText: response.statusText,
				error: errorData.error || 'Unknown error',
			});
			return null;
		}
		
		const data = await response.json();
		
		// Validate response structure
		if (!data || typeof data.zone_id === 'undefined') {
			console.error('[Zone API] Invalid response structure:', data);
			return null;
		}
		
		return {
			zone_id: data.zone_id,
			zone_data: data.zone_data || [],
		};
	} catch (error: any) {
		console.error('[Zone API] Error:', {
			message: error?.message || 'Unknown error',
			name: error?.name,
		});
		return null;
	}
}
		
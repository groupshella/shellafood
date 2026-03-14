import { cache } from "react";

interface LocationResult {
    lat: number;
    lng: number;
    displayName: string;
    country?: string;
    city?: string;
    state?: string;
    district?: string;
    street?: string;
    postcode?: string;
}

// In-memory cache for client-side caching
const locationCache = new Map<string, { data: LocationResult; timestamp: number }>();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

// Cached fetch function using React's cache
const getCachedLocationAddress = cache(
	async (lat: number, lng: number): Promise<LocationResult | null> => {
		// Create cache key
		const cacheKey = `${lat.toFixed(6)}-${lng.toFixed(6)}`;
		
		// Check in-memory cache first
		const cached = locationCache.get(cacheKey);
		if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
			return cached.data;
		}
		
		let locationResult: LocationResult | null = null;
		
		try {
			const res = await fetch(
				`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
				{
					headers: {
						Accept: "application/json",
						"User-Agent": "YourAppName/1.0",
					},
					cache: 'no-store',
				}
			);

			if (!res.ok) {
				throw new Error(`Failed to fetch address: ${res.status}`);
			}

			const data = await res.json();

			locationResult = {
				lat: lat,
				lng: lng,
				displayName: data.display_name,
				country: data.address?.country,
				state: data.address?.state,
				city: data.address?.city || data.address?.town,
				district: data.address?.suburb || data.address?.neighbourhood,
				street: data.address?.road,
				postcode: data.address?.postcode,
			} as LocationResult;
			
			// Store in in-memory cache
			if (locationResult) {
				locationCache.set(cacheKey, {
					data: locationResult,
					timestamp: Date.now(),
				});
			}
		} catch (err) {
			console.error("Failed to fetch address", err);
		}
		
		return locationResult;
	}
);

export const fetchLocationAddress = async (location: { lat: number; lng: number }): Promise<LocationResult | null> => {
	return getCachedLocationAddress(location.lat, location.lng);
};

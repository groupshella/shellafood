// features/categories/api/modules.api.ts

import { getBaseUrl } from '@/features/auth/constants/auth.constants';
import { cookies } from 'next/headers';
import { BASE_URL } from '@/features/cart/constants/cart.constants';
import { cache } from 'react';

interface ZoneData {
  zone_id: number;
  zone_data: Array<{
    modules: any[];
  }>;
}

const DEFAULT_LANG = 'ar';

/**
 * Get the base URL for internal API calls
 * This handles different environments correctly
 */

export const getZoneDataFromLocation = cache(
  async (
    latitude: number,
    longitude: number,
    lang: string = DEFAULT_LANG
  ): Promise<ZoneData | null> => {
    try {
      const baseUrl = getBaseUrl();
      const url = `${baseUrl}/api/modules?latitude=${latitude}&longitude=${longitude}&lang=${lang}`;
      const cacheTag = `zone-${latitude.toFixed(4)}-${longitude.toFixed(4)}`;
      
      console.log('[Zone API] Fetching from:', url);
      
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
        },
        next: {
          revalidate: 1,
          tags: [cacheTag],
        },
      });
      console.log("response", response);
      
      if (!response.ok) {
        console.error('[Zone API] Error:', response.status);
        return null;
      }
      
      const data = await response.json();
  
      return {
        zone_id: data.zone_id,
        zone_data: data.zone_data || [],
      };
      
    } catch (error: any) {
      console.error('[Zone API] Error:', error?.message || error);
      return null;
    }
  }
);

export const getZoneModules = cache(
  async (latitude: number, longitude: number, lang: string = DEFAULT_LANG) => {
    const zoneData = await getZoneDataFromLocation(latitude, longitude, lang);
    return zoneData?.zone_data?.[0].modules || [];
  }
);
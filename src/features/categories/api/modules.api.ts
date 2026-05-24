import { cache } from 'react';
import type { ZoneDataModule } from '@/features/categories/types/module.types';

interface ZoneData {
  zone_id: string | number | null;
  zone_data: Array<{
    modules: ZoneDataModule[];
  }>;
}

const DEFAULT_LANG = 'ar';
const REQUEST_TIMEOUT = 10_000;
const ZONE_API_URL = 'https://shellafood.com/api/v1/config/get-zone-id';

export const getZoneDataFromLocation = cache(
  async (
    latitude: number,
    longitude: number,
    lang: string = DEFAULT_LANG
  ): Promise<ZoneData | null> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    try {
      const url = `${ZONE_API_URL}?lat=${latitude}&lng=${longitude}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'X-localization': lang,
          // Realistic UA prevents Cloudflare from blocking server-side requests
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        },
        signal: controller.signal,
        cache: 'no-store',
      });

      clearTimeout(timeoutId);

      // 404 = valid response meaning coords are outside all zones
      if (response.status === 404) {
        return { zone_id: null, zone_data: [] };
      }

      if (!response.ok) {
        return null;
      }

      const data = await response.json();

      if (!data || data.zone_id === null || data.zone_id === undefined) {
        return { zone_id: null, zone_data: [] };
      }

      return {
        zone_id: data.zone_id,
        zone_data: data.zone_data ?? [],
      };
    } catch (error: unknown) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        return null;
      }
      return null;
    }
  }
);

export const getZoneModules = cache(
  async (
    latitude: number,
    longitude: number,
    lang: string = DEFAULT_LANG
  ): Promise<ZoneDataModule[]> => {
    const zoneData = await getZoneDataFromLocation(latitude, longitude, lang);
    return zoneData?.zone_data?.[0]?.modules ?? [];
  }
);
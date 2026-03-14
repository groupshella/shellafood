// features/categories/api/modules.api.ts

import { getBaseUrl } from '@/features/auth/constants/auth.constants';
import { cache } from 'react';
import type { Offer } from '@/shared/types/offer.types';

const DEFAULT_LANG = 'ar';


export const getOffers = cache(
  async (
    zoneId: number,
    moduleId: number,
    lang: string = DEFAULT_LANG
  ): Promise<Offer[] | null> => {
    try {
      const baseUrl = getBaseUrl();
      const url = `${baseUrl}/api/offers?zoneId=${zoneId}&moduleId=${moduleId}&lang=${lang}`;
      const cacheTag = `offers-${zoneId}-${moduleId}`;
      
      console.log('[Offers API] Fetching from:', url);
      
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
        console.error('[Offers API] Error:', response.status);
        return null;
      }
      
      const data = await response.json();
      
      return data.offers || [];
      
    } catch (error: any) {
      console.error('[Offers API] Error:', error?.message || error);
      return null;
    }
  }
);

export const getCachedOffers = cache(
  async (zoneId: number, moduleId: number, lang: string = DEFAULT_LANG): Promise<Offer[] | null> => {
    const offers = await getOffers(zoneId, moduleId, lang);
    return offers as Offer[] || [];
  }
);
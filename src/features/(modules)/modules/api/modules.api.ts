import { cache } from 'react';
import { MODULES_API, DEFAULT_LANG } from '../constants/modules.constants';
import { Category, Module } from '../types/module.types';

const getZoneDataFromLocation = cache(
  async (
    latitude: number,
    longitude: number,
    lang: string = DEFAULT_LANG
  ): Promise<any | null> => {
    try {
      const url = `${MODULES_API.ZONE_API_URL}?lat=${latitude}&lng=${longitude}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'X-localization': lang,
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        },
        cache: 'no-store',
      });
      if (response.status === 404) {
        return { zone_id: null, zone_data: [] };
      }
      if (!response.ok) {
        return null;
      }
      const data = await response.json();
      return {
        zone_id: data.zone_id,
        zone_data: data.zone_data ?? [],
      };
    } catch (error: unknown) {
      return null;
    }
  }
);

export const getModules = cache(
  async (
    latitude: number,
    longitude: number,
    lang: string = DEFAULT_LANG
  ): Promise<Module[]> => {
    const zoneData = await getZoneDataFromLocation(latitude, longitude, lang);
    return zoneData?.zone_data?.[0]?.modules.map((module: Module) => ({
      id: module.id,
      module_name: module.module_name,
      thumbnail: module.thumbnail
    })) ?? [];
  }
);


export const getModuleCategories = cache(
  async (
    moduleId: string,
    zoneId: string = '[2]',
    locale: string = DEFAULT_LANG,
    latitude: string = '24.7136',
    longitude: string = '46.6753'
  ): Promise<Category[] | null> => {
    try {
      const response = await fetch('https://shellafood.com/api/v1/categories', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          zoneId,
          moduleId,
          latitude,
          longitude,
          'X-localization': locale,
          'Accept-Language': locale,
        },
        cache: 'no-store',
      });

      if (!response.ok) {
        console.warn(`[Categories API] Non-ok response: ${response.status}`);
        return null;
      }

      const data = await response.json();
      const categories = Array.isArray(data) ? data : data.categories ?? data.data ?? [];
      return categories.map((category: Category) => ({
        id: category.id,
        name: category.name,
        image: category.image
      }));
    } catch (error) {
      console.error('[Categories API] Error:', error);
      return null;
    }
  }
);
import { cookies } from 'next/headers';
import { getBaseUrl } from '@/features/auth/constants/auth.constants';
import { CategoriesPage } from '@/features/categories/components/category-list';
import type { ZoneDataModule } from '@/features/categories/types/module.types';

const DEFAULT_LAT = 24.6100;
const DEFAULT_LNG = 46.5995;
const DEFAULT_LANG = 'ar';

export default async function CategoriesPageRoute() {
  let latitude = DEFAULT_LAT;
  let longitude = DEFAULT_LNG;

  const cookieStore = await cookies();
  const locationCookie = cookieStore.get('user_location')?.value;
  if (locationCookie) {
    try {
      const parsed = JSON.parse(locationCookie);
      if (parsed?.lat != null && parsed?.lng != null) {
        const lat = parseFloat(String(parsed.lat));
        const lng = parseFloat(String(parsed.lng));
        if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
          latitude = lat;
          longitude = lng;
        }
      }
    } catch {
      // use defaults
    }
  }

  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/api/modules?latitude=${latitude}&longitude=${longitude}&lang=${DEFAULT_LANG}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      cache: 'no-store',
    });
    if (!response.ok) {
      console.error('[Categories] Failed to fetch modules:', response.status);
      return <CategoriesPage initialModules={[]} />;
    }

    const data = await response.json();
    const modules: ZoneDataModule[] = Array.isArray(data?.zone_data?.[0]?.modules)
      ? data.zone_data[0].modules
      : [];
    return <CategoriesPage initialModules={modules} />;
  } catch (error) {
    console.error('[Categories] Error fetching modules:', error);
    return <CategoriesPage initialModules={[]} />;
  }
}

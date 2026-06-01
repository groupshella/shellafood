import { cookies } from 'next/headers';
import { getBaseUrl } from '@/features/(actors)/auth/constants/auth.constants';
import { CategoriesPage } from '@/features/categories/components/category-list';
import { getZoneModules } from '@/features/categories/api/modules.api';


export default async function CategoriesPageRoute() {
  // FIX: Updated to coordinates confirmed inside zone 2 polygon
  // Old: 24.61, 46.5995 — was right on/outside the northern boundary
  // New: 24.567752, 46.5444937 — confirmed working from API test
  const DEFAULT_LAT = 24.567752;
  const DEFAULT_LNG = 46.5444937;


  const cookieStore = await cookies();
  const locationCookie = cookieStore.get('user_location')?.value;

  let latitude = DEFAULT_LAT;
  let longitude = DEFAULT_LNG;

  if (locationCookie) {
    try {
      const parsed = JSON.parse(locationCookie) as Record<string, unknown>;
      const latRaw = parsed.lat ?? parsed.latitude;
      const lngRaw = parsed.lng ?? parsed.longitude;
      if (latRaw != null && lngRaw != null) {
        const lat = parseFloat(String(latRaw));
        const lng = parseFloat(String(lngRaw));
        if (
          !Number.isNaN(lat) &&
          !Number.isNaN(lng) &&
          lat >= -90 &&
          lat <= 90 &&
          lng >= -180 &&
          lng <= 180
        ) {
          latitude = lat;
          longitude = lng;
        }
      }
    } catch {
      // ignore invalid cookie
    }
  }

  const modules = await getZoneModules(latitude, longitude);

  return <CategoriesPage initialModules={modules} />;
}

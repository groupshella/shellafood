
import { cookies } from 'next/headers';
import { getZoneModules } from '@/features/categories/api/modules.api';
import { HomePage } from '@/features/home/components';
import { ZoneDataModule } from '@/features/categories/types/module.types';


export default async function HomePageRoute() {
	const cookieStore = await cookies();	
	const token = cookieStore.get('auth_token')?.value;
  const DEFAULT_LAT = 24.6100;
  const DEFAULT_LNG = 46.5995;
  
  const locationCookie = cookieStore.get('user_location')?.value;

  let latitude = DEFAULT_LAT;
  let longitude = DEFAULT_LNG;

//   // ✅ Parse location from cookie if available
//   if (locationCookie) {
//     try {
//       const parsed =JSON.parse(locationCookie);
//       if (parsed.lat && parsed.lng) {
//         const lat = parseFloat(parsed.lat);
//         const lng = parseFloat(parsed.lng);
        
//         if (!isNaN(lat) && !isNaN(lng) && 
//             lat >= -90 && lat <= 90 && 
//             lng >= -180 && lng <= 180) {
//           latitude = lat;
//           longitude = lng;
//         }
//       }
//     } catch (error) {
//       console.error('[Categories] Invalid location cookie:', error);
//     }
//   }

  // ✅ Fetch modules directly (cleaner API)
  const modules = await getZoneModules(latitude, longitude, 'ar');

  return (
	<HomePage modules={modules as ZoneDataModule[]} token={token as string}/>
	);
}


import { cookies } from 'next/headers';
import ModulesPage from '@/features/(modules)/modules/components/ModulesPage';
import { MODULES_CONFIG } from '@/features/(modules)/modules/constants/modules.constants';
import { getModules } from '@/features/(modules)/modules/api/modules.api';

export default async function ModulesPageRoute() {
  // const cookieStore = await cookies();
  // const locationCookie = cookieStore.get('user_location')?.value;
  let latitude = MODULES_CONFIG.DEFAULT_LAT;
  let longitude = MODULES_CONFIG.DEFAULT_LNG;

  const modules = await getModules(latitude, longitude);
  return <ModulesPage modules={modules} />;
}
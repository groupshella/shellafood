import { NextRequest, NextResponse } from 'next/server';
import { getCachedStoreDetails } from '@/features/categories/api/stores.api';
import { DEFAULT_LANG } from '@/features/auth/constants/auth.constants';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  
  const storeId = Number(searchParams.get('storeId'));
  const moduleId = Number(searchParams.get('moduleId'));
  const limit = Number(searchParams.get('limit')) || 12;
  const offset = Number(searchParams.get('offset')) || 1;
  const locale = DEFAULT_LANG;
  const zoneId = Number(searchParams.get('zoneId')) || 2;
  const cookieStore = await cookies();
  const userLocation = cookieStore.get('user_location');

  const longitude = userLocation?.value.split(',')[0] || '46.5995713';
  const latitude = userLocation?.value.split(',')[1] || '24.6100271';
  // Validate params
  if (!storeId || isNaN(storeId) || !moduleId || isNaN(moduleId)) {
    return NextResponse.json(
      { error: 'Invalid store ID or module ID' },
      { status: 400 }
    );
  }

  try {
    const storeDetailsResponse = await getCachedStoreDetails(
      limit,
      offset,
      locale,
      moduleId,
      zoneId,
      storeId,
      longitude,
      latitude
    );

    if (!storeDetailsResponse?.data) {
      return NextResponse.json(
        { error: 'Failed to fetch store details' },
        { status: 500 }
      );
    }

    // ✅ Return with cache headers
    return NextResponse.json(storeDetailsResponse.data, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        'CDN-Cache-Control': 'max-age=600',
      },
    });
  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


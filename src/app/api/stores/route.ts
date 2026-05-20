
import { NextRequest, NextResponse } from 'next/server';
import { getAllStores } from '@/features/categories/api/stores.api';
import { DEFAULT_LANG } from '@/features/auth/constants/auth.constants';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const moduleId = Number(searchParams.get('moduleId'));
  const limit = Number(searchParams.get('limit')) || 12;
  const offset = Number(searchParams.get('offset')) || 0;
  const locale = DEFAULT_LANG;
  const zoneId = Number(searchParams.get('zoneId')) || 2;
  const cookieStore = await cookies();
  const userLocation = cookieStore.get('user_location');

  const latitude = userLocation?.value.split(',')[0] || '24.567752';
  const longitude = userLocation?.value.split(',')[1] || '46.5444937';

  // Validate params
  if (!moduleId || isNaN(moduleId)) {
    console.error('[Stores API Route] Invalid module ID:', moduleId);
    return NextResponse.json(
      { error: 'Invalid module ID' },
      { status: 400 }
    );
  }

  try {
    const storeListResponse = await getAllStores(
      limit,
      offset,
      locale,
      moduleId,
      zoneId,
      longitude,
      latitude
    );

    if (!storeListResponse?.data) {
      return NextResponse.json(
        {
          error: storeListResponse?.error || 'Failed to fetch stores',
          details: storeListResponse?.error
        },
        { status: storeListResponse?.status || 500 }
      );
    }

    // ✅ Return with cache headers
    return NextResponse.json(storeListResponse.data, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        'CDN-Cache-Control': 'max-age=600',
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Internal server error', details: error?.message },
      { status: 500 }
    );
  }
}
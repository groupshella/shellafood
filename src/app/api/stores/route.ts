
import { NextRequest, NextResponse } from 'next/server';
import { getAllStores } from '@/features/categories/api/stores.api';
import { DEFAULT_LANG } from '@/features/(actors)/auth/constants/auth.constants';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const moduleId = Number(searchParams.get('moduleId'));
  const limit = Number(searchParams.get('limit')) || 12;
  const offset = Number(searchParams.get('offset')) || 0;
  const locale = DEFAULT_LANG;
  const zoneId = Number(searchParams.get('zoneId')) || 2;
  const latitude = searchParams.get('latitude') || '24.567752';
  const longitude = searchParams.get('longitude') || '46.5444937';
  console.log("latitude", latitude);
  console.log("longitude", longitude);

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
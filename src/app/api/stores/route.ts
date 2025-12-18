
import { NextRequest, NextResponse } from 'next/server';
import { getCachedAllStores } from '@/features/categories/api/stores.api';
import { DEFAULT_LANG } from '@/features/auth/constants/auth.constants';

export const runtime = 'edge'; // ✅ Deploy to edge for low latency

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  
  const moduleId = Number(searchParams.get('moduleId'));
  const limit = Number(searchParams.get('limit')) || 12;
  const offset = Number(searchParams.get('offset')) || 0;
  const locale =  DEFAULT_LANG;
  const zoneId = Number(searchParams.get('zoneId')) || 2;

  // Validate params
  if (!moduleId || isNaN(moduleId)) {
    return NextResponse.json(
      { error: 'Invalid module ID' },
      { status: 400 }
    );
  }

  try {
    const storeListResponse = await getCachedAllStores(
      limit,
      offset,
      locale,
      moduleId,
      zoneId
    );

    if (!storeListResponse?.data) {
      return NextResponse.json(
        { error: 'Failed to fetch stores' },
        { status: 500 }
      );
    }

    // ✅ Return with cache headers
    return NextResponse.json(storeListResponse.data, {
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

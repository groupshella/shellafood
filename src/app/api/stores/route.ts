
import { NextRequest, NextResponse } from 'next/server';
import { getCachedAllStores } from '@/features/categories/api/stores.api';
import { DEFAULT_LANG } from '@/features/auth/constants/auth.constants';

// Removed edge runtime to avoid compatibility issues with external API calls

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
  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
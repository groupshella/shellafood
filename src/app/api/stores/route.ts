
import { NextRequest, NextResponse } from 'next/server';
import { getAllStores, getCachedAllStores } from '@/features/categories/api/stores.api';
import { DEFAULT_LANG } from '@/features/auth/constants/auth.constants';

// Removed edge runtime to avoid compatibility issues with external API calls

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  
  const moduleId = Number(searchParams.get('moduleId'));
  const limit = Number(searchParams.get('limit')) || 12;
  const offset = Number(searchParams.get('offset')) || 0;
  const locale =  DEFAULT_LANG;
  const zoneId = Number(searchParams.get('zoneId')) || 2;

  console.log('[Stores API Route] Incoming request:', {
    moduleId,
    limit,
    offset,
    locale,
    zoneId,
    url: request.url,
    headers: Object.fromEntries(request.headers.entries()),
  });

  // Validate params
  if (!moduleId || isNaN(moduleId)) {
    console.error('[Stores API Route] Invalid module ID:', moduleId);
    return NextResponse.json(
      { error: 'Invalid module ID' },
      { status: 400 }
    );
  }

  try {
    console.log('[Stores API Route] Calling getCachedAllStores...');
    const storeListResponse = await getAllStores(
      limit,
      offset,
      locale,
      moduleId,
      zoneId
    );

    console.log('[Stores API Route] Response received:', {
      hasData: !!storeListResponse?.data,
      error: storeListResponse?.error,
      status: storeListResponse?.status,
      storeCount: storeListResponse?.data?.stores?.length || 0,
    });

    if (!storeListResponse?.data) {
      console.error('[Stores API Route] No data in response:', {
        error: storeListResponse?.error,
        status: storeListResponse?.status,
        fullResponse: JSON.stringify(storeListResponse),
      });
      return NextResponse.json(
        { 
          error: storeListResponse?.error || 'Failed to fetch stores',
          details: storeListResponse?.error 
        },
        { status: storeListResponse?.status || 500 }
      );
    }

    console.log('[Stores API Route] Returning success response');
    // ✅ Return with cache headers
    return NextResponse.json(storeListResponse.data, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        'CDN-Cache-Control': 'max-age=600',
      },
    });
  } catch (error: any) {
    console.error('[Stores API Route] Caught error:', {
      message: error?.message,
      stack: error?.stack,
      name: error?.name,
      cause: error?.cause,
    });
    return NextResponse.json(
      { error: 'Internal server error', details: error?.message },
      { status: 500 }
    );
  }
}
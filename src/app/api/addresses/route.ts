import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { DEFAULT_LANG } from '@/features/auth/constants/auth.constants';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const limit = Number(searchParams.get('limit')) || 10;
  const offset = Number(searchParams.get('offset')) || 1;
  const locale = searchParams.get('locale') || DEFAULT_LANG;

  try {
    // Get auth token from cookies
    const cookieStore = await cookies();
    const authToken = cookieStore.get('auth_token')?.value;

    if (!authToken) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const url = `https://shellafood.com/api/v1/customer/address/list?limit=${limit}&offset=${offset}`;

    console.log('[Addresses API Route] Fetching addresses:', {
      limit,
      offset,
      locale,
      url,
    });

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'X-localization': locale,
        'Authorization': `Bearer ${authToken}`,
        'Host': 'shellafood.com',
      },
      next: {
        revalidate: 10, // Re-fetch every 10 seconds
        tags: [`addresses-${authToken.substring(0, 10)}`],
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Addresses API Route] Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
      });

      return NextResponse.json(
        { 
          error: `Failed to fetch addresses: ${response.statusText}`,
          details: errorText 
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    console.log('[Addresses API Route] Success:', {
      addressesCount: data?.addresses?.length ?? 0,
      totalSize: data?.total_size,
    });

    // Return with cache headers
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=30',
        'CDN-Cache-Control': 'max-age=10',
      },
    });
  } catch (error: any) {
    console.error('[Addresses API Route] Caught error:', {
      message: error?.message,
      stack: error?.stack,
      name: error?.name,
    });
    return NextResponse.json(
      { error: 'Internal server error', details: error?.message },
      { status: 500 }
    );
  }
}


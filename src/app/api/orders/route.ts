import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { DEFAULT_LANG } from '@/features/auth/constants/auth.constants';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const limit = Number(searchParams.get('limit')) || 20;
  const offset = Number(searchParams.get('offset')) || 1;
  const guestId = searchParams.get('guest_id') || '';

  try {
    // Get cookies
    const cookieStore = await cookies();
    const authToken = cookieStore.get('auth_token')?.value;
    const locale = request.headers.get('x-localization') || DEFAULT_LANG;

    if (!authToken) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Build URL with query params
    const queryParams = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
    });
    if (guestId) {
      queryParams.append('guest_id', guestId);
    }

    const url = `https://shellafood.com/api/v1/customer/order/list?${queryParams.toString()}`;

    console.log('[Orders API Route] Fetching orders:', {
      url,
      limit,
      offset,
      guestId,
      locale,
    });

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Host': 'shellafood.com', // Required for Cloudflare bypass
        'Origin': 'https://shellafood.com',
        'Referer': 'https://shellafood.com/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36',
        'X-localization': locale,
        'X-Response-Mode': 'minimal',
        'Authorization': `Bearer ${authToken}`,
      },
      next: {
        revalidate: 0, // Always fetch fresh orders
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Orders API Route] Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
      });

      return NextResponse.json(
        { 
          error: `Failed to fetch orders: ${response.statusText}`,
          details: errorText 
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    console.log('[Orders API Route] Success:', {
      ordersCount: data?.orders?.length ?? 0,
      totalSize: data?.total_size,
    });

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('[Orders API Route] Caught error:', {
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


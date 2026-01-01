import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { DEFAULT_LANG } from '@/features/auth/constants/auth.constants';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const orderId = searchParams.get('order_id');
  const locale = searchParams.get('locale') || DEFAULT_LANG;

  // Validate params
  if (!orderId) {
    return NextResponse.json(
      { error: 'Order ID is required' },
      { status: 400 }
    );
  }

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

    const url = `https://shellafood.com/api/v1/customer/order/details?order_id=${orderId}`;

    console.log('[Order Details API Route] Fetching order:', {
      orderId,
      locale,
      url,
    });

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Host': 'shellafood.com',
        'X-localization': locale,
        'Authorization': `Bearer ${authToken}`,
      },
      next: {
        revalidate: 60, // Re-fetch every minute for order tracking
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Order Details API Route] Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
      });

      return NextResponse.json(
        { 
          error: `Failed to fetch order details: ${response.statusText}`,
          details: errorText 
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    console.log('[Order Details API Route] Success:', {
      orderId,
      itemsCount: Array.isArray(data) ? data.length : 0,
    });

    // Return with cache headers
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
        'CDN-Cache-Control': 'max-age=60',
      },
    });
  } catch (error: any) {
    console.error('[Order Details API Route] Caught error:', {
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


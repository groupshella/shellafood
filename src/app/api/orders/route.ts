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

    const url = `https://shellafood.com/api/v1/customer/order/running-orders?${queryParams.toString()}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Host': 'shellafood.com',
        'X-localization': locale,
        'X-Response-Mode': 'minimal',
        'Authorization': `Bearer ${authToken}`,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorText = await response.text();

      return NextResponse.json(
        {
          error: `Failed to fetch orders: ${response.statusText}`,
          details: errorText
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Internal server error', details: error?.message },
      { status: 500 }
    );
  }
}


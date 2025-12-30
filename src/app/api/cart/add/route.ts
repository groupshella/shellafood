import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { DEFAULT_LANG } from '@/features/auth/constants/auth.constants';

export async function POST(request: NextRequest) {
  try {
    // Get cookies
    const cookieStore = await cookies();
    const authToken = cookieStore.get('auth_token')?.value;
    const guestId = cookieStore.get('guest_id')?.value;
    const moduleId = cookieStore.get('moduleId')?.value || request.headers.get('moduleId') || '3';
    const zoneId = cookieStore.get('zoneId')?.value || request.headers.get('zoneId') || '2';
    const locale = request.headers.get('x-localization') || DEFAULT_LANG;

    if (!guestId) {
      return NextResponse.json(
        { error: 'Guest ID required' },
        { status: 400 }
      );
    }

    const body = await request.json();

    const url = `https://shellafood.com/api/v1/customer/cart/add`;

    console.log('[Cart API Route] Adding to cart:', {
      url,
      guestId,
      moduleId,
      zoneId,
      locale,
    });

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Host': 'shellafood.com', // Required for Cloudflare bypass
        'Origin': 'https://shellafood.com',
        'Referer': 'https://shellafood.com/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36',
        'X-localization': locale,
        'moduleId': moduleId,
        'zoneId': `[${zoneId}]`, // Format as array string
        ...(authToken && { 'Authorization': `Bearer ${authToken}` }),
      },
      body: JSON.stringify({
        ...body,
        guest_id: guestId,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Cart API Route] Add Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
      });

      return NextResponse.json(
        { 
          error: `Failed to add to cart: ${response.statusText}`,
          details: errorText 
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    console.log('[Cart API Route] Add Success');

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('[Cart API Route] Caught error:', {
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


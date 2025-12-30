import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { DEFAULT_LANG } from '@/features/auth/constants/auth.constants';

export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const guestId = searchParams.get('guest_id');

  if (!guestId) {
    return NextResponse.json(
      { error: 'Guest ID required' },
      { status: 400 }
    );
  }

  try {
    // Get cookies
    const cookieStore = await cookies();
    const authToken = cookieStore.get('auth_token')?.value;
    const moduleId = cookieStore.get('moduleId')?.value || searchParams.get('moduleId') || '3';
    const zoneId = cookieStore.get('zoneId')?.value || searchParams.get('zoneId') || '2';
    const locale = request.headers.get('x-localization') || DEFAULT_LANG;

    const url = `https://shellafood.com/api/v1/customer/cart/remove?guest_id=${guestId}`;

    console.log('[Cart API Route] Clearing cart:', {
      url,
      guestId,
      moduleId,
      zoneId,
      locale,
    });

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
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
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Cart API Route] Clear Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
      });

      return NextResponse.json(
        { 
          error: `Failed to clear cart: ${response.statusText}`,
          details: errorText 
        },
        { status: response.status }
      );
    }

    const data = await response.json().catch(() => ({ success: true }));

    console.log('[Cart API Route] Clear Success');

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


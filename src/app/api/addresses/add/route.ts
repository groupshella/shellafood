import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { DEFAULT_LANG } from '@/features/auth/constants/auth.constants';

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const locale = request.headers.get('x-localization') || DEFAULT_LANG;

    const url = `https://shellafood.com/api/v1/customer/address/add`;

    console.log('[Addresses API Route] Adding address:', {
      url,
      locale,
    });

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-localization': locale,
        'Authorization': `Bearer ${authToken}`,
        'Host': 'shellafood.com', // Required for Cloudflare bypass
        'Origin': 'https://shellafood.com',
        'Referer': 'https://shellafood.com/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Addresses API Route] Add Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
      });

      return NextResponse.json(
        { 
          error: `Failed to add address: ${response.statusText}`,
          details: errorText 
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    console.log('[Addresses API Route] Add Success');

    return NextResponse.json(data);
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


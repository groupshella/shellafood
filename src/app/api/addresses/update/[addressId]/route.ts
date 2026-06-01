import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { DEFAULT_LANG } from '@/features/(actors)/auth/constants/auth.constants';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ addressId: string }> }
) {
  try {
    const { addressId } = await params;
    const addressIdNum = Number(addressId);

    if (!addressIdNum || isNaN(addressIdNum)) {
      return NextResponse.json(
        { error: 'Invalid address ID' },
        { status: 400 }
      );
    }

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

    const url = `https://shellafood.com/api/v1/customer/address/update/${addressIdNum}`;

    console.log('[Addresses API Route] Updating address:', {
      addressId: addressIdNum,
      url,
      locale,
    });

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-localization': locale,
        'Authorization': `Bearer ${authToken}`,
        'Host': 'shellafood.com',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Addresses API Route] Update Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
      });

      return NextResponse.json(
        {
          error: `Failed to update address: ${response.statusText}`,
          details: errorText
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    console.log('[Addresses API Route] Update Success');

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


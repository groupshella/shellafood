import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const addressId = Number(searchParams.get('address_id'));

  if (!addressId || isNaN(addressId)) {
    return NextResponse.json(
      { error: 'Invalid address ID' },
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

    const url = `https://shellafood.com/api/v1/customer/address/delete?address_id=${addressId}`;

    console.log('[Addresses API Route] Deleting address:', {
      addressId,
      url,
    });

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${authToken}`,
        'Host': 'shellafood.com', // Required for Cloudflare bypass
        'Origin': 'https://shellafood.com',
        'Referer': 'https://shellafood.com/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Addresses API Route] Delete Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
      });

      return NextResponse.json(
        { 
          error: `Failed to delete address: ${response.statusText}`,
          details: errorText 
        },
        { status: response.status }
      );
    }

    const data = await response.json().catch(() => ({ success: true }));

    console.log('[Addresses API Route] Delete Success');

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


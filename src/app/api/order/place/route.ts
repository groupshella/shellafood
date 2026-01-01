import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { DEFAULT_LANG } from '@/features/auth/constants/auth.constants';

export async function POST(request: NextRequest) {
  try {
    // Get cookies
    const cookieStore = await cookies();
    const authToken = cookieStore.get('auth_token')?.value;
    const moduleId = cookieStore.get('moduleId')?.value || request.headers.get('moduleId') || '3';
    const zoneId = cookieStore.get('zoneId')?.value || request.headers.get('zoneId') || '2';
    const locale = request.headers.get('x-localization') || DEFAULT_LANG;

    if (!authToken) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();

    const url = `https://shellafood.com/api/v1/customer/order/place`;

    console.log('[Order Place API Route] Placing order:', {
      url,
      moduleId,
      zoneId,
      locale,
      storeId: body.store_id,
    });

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Host': 'shellafood.com',
        'X-localization': locale,
        'moduleId': moduleId,
        'zoneId': `[${zoneId}]`, // Format as array string
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Order Place API Route] Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
      });

      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { error: errorText || 'Failed to place order' };
      }

      return NextResponse.json(
        { 
          error: errorData.error || errorData.message || `Failed to place order: ${response.statusText}`,
          details: errorData 
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    console.log('[Order Place API Route] Success:', {
      orderId: data.order_id || data.id || data.data?.order_id,
    });

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('[Order Place API Route] Caught error:', {
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


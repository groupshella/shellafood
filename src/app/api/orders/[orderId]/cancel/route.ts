import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { DEFAULT_LANG, BASE_URL } from '@/features/auth/constants/auth.constants';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;
    const cookieStore = await cookies();
    const authToken = cookieStore.get('auth_token')?.value;
    const locale = request.headers.get('x-localization') || DEFAULT_LANG;

    if (!authToken) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const reason = body.reason || 'Changed my mind';

    const url = `https://shellafood.com/api/v1/customer/order/cancel`;

    console.log('[Cancel Order API Route] Cancelling order:', {
      orderId,
      reason,
      locale,
    });

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Host': "shellafood.com",
        'X-localization': locale,
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        order_id: parseInt(orderId),
        reason: reason,
      }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error('[Cancel Order API Route] Error:', {
        status: response.status,
        statusText: response.statusText,
        error: responseData,
      });

      return NextResponse.json(
        {
          success: false,
          error: responseData.message || responseData.error || 'Failed to cancel order',
        },
        { status: response.status }
      );
    }

    console.log('[Cancel Order API Route] Success:', {
      orderId,
      message: responseData.message,
    });

    return NextResponse.json({
      success: true,
      message: responseData.message || 'تم إلغاء الطلب بنجاح',
      data: responseData,
    });
  } catch (error: any) {
    console.error('[Cancel Order API Route] Caught error:', {
      message: error?.message,
      stack: error?.stack,
      name: error?.name,
    });
    return NextResponse.json(
      { success: false, error: 'Internal server error', details: error?.message },
      { status: 500 }
    );
  }
}


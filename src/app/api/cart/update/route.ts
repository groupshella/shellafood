import { NextRequest, NextResponse } from 'next/server';
import { updateCart } from '@/features/cart';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const locale = request.headers.get('x-localization') || 'ar';
    const data = await updateCart(body, locale);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('[Cart API Route] Update Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to update cart' },
      { status: 500 }
    );
  }
}
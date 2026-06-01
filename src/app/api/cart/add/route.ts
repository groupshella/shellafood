import { NextRequest, NextResponse } from 'next/server';
import { addToCart } from '@/features/cart'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const locale = request.headers.get('x-localization') || 'ar';
    const data = await addToCart(body, locale);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('[Cart API Route] Add Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to add to cart' },
      { status: 500 }
    );
  }
}
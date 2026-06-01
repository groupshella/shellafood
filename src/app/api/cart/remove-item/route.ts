import { NextRequest, NextResponse } from 'next/server';
import { removeCartItem } from '@/features/cart';

export async function DELETE(request: NextRequest) {
  try {
    const cartId = request.nextUrl.searchParams.get('cart_id');
    const guestId = request.nextUrl.searchParams.get('guest_id');
    if (!cartId || !guestId) {
      return NextResponse.json({ error: 'Cart ID and Guest ID required' }, { status: 400 });
    }
    const locale = request.headers.get('x-localization') || 'ar';
    const data = await removeCartItem(cartId, guestId, locale);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('[Cart API Route] Remove Item Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to remove item' },
      { status: 500 }
    );
  }
}
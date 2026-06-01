import { NextRequest, NextResponse } from 'next/server';
import { clearCart } from '@/features/cart';

export async function DELETE(request: NextRequest) {
  try {
    const guestId = request.nextUrl.searchParams.get('guest_id');
    if (!guestId) {
      return NextResponse.json({ error: 'Guest ID required' }, { status: 400 });
    }
    const locale = request.headers.get('x-localization') || 'ar';
    const data = await clearCart(guestId, locale);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('[Cart API Route] Clear Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to clear cart' },
      { status: 500 }
    );
  }
}
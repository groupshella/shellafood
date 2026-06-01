import { NextRequest, NextResponse } from 'next/server';
import { getAllCartItems } from '@/features/cart';

export async function GET(request: NextRequest) {
  try {
    const guestId = request.nextUrl.searchParams.get('guest_id');
    if (!guestId) {
      return NextResponse.json({ error: 'Guest ID required' }, { status: 400 });
    }
    const locale = request.headers.get('x-localization') || 'ar';
    const data = await getAllCartItems(guestId, locale);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('[Cart API Route] List Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch cart' },
      { status: 500 }
    );
  }
}
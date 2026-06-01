/**
 * src/app/api/checkout/place-order/route.ts
 *
 * POST /api/checkout/place-order
 * Reads cookies server-side, forwards to Laravel, returns result.
 */
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { placeOrder } from '@/features/checkout/api/checkout.api';
import { DEFAULT_LANG } from '@/features/(actors)/auth/constants/auth.constants';

export async function POST(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const guestId = cookieStore.get('guest_id')?.value;
        const locale = request.headers.get('x-localization') || DEFAULT_LANG;

        const body = await request.json();

        // Attach guest_id and use_cart flag automatically
        const payload = {
            ...body,
            ...(guestId ? { guest_id: guestId } : {}),
            use_cart: true, // Always use DB cart (items already in cart)
        };

        const result = await placeOrder(payload, locale);

        return NextResponse.json(result, { status: 201 });
    } catch (error: any) {
        console.error('[Checkout] place-order error:', error.message);
        return NextResponse.json(
            { error: error.message || 'Failed to place order' },
            { status: 400 }
        );
    }
}
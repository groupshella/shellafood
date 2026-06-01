/**
 * src/app/api/checkout/delivery-fee/route.ts
 *
 * POST /api/checkout/delivery-fee
 * Calculates delivery charge before placing order.
 */
import { NextRequest, NextResponse } from 'next/server';
import { preparePayment } from '@/features/checkout/api/checkout.api';
import { DEFAULT_LANG } from '@/features/(actors)/auth/constants/auth.constants';

export async function POST(request: NextRequest) {
    try {
        const locale = request.headers.get('x-localization') || DEFAULT_LANG;
        const body = await request.json();

        const result = await preparePayment(
            { ...body, payment_method: 'cash_on_delivery' },
            locale
        );

        return NextResponse.json(result.payment_data, { status: 200 });
    } catch (error: any) {
        console.error('[Checkout] delivery-fee error:', error.message);
        return NextResponse.json(
            { error: error.message || 'Failed to calculate delivery fee' },
            { status: 400 }
        );
    }
}
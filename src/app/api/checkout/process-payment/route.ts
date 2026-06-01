/**
 * src/app/api/checkout/process-payment/route.ts
 *
 * POST /api/checkout/process-payment
 */
import { NextRequest, NextResponse } from 'next/server';
import { processPayment } from '@/features/checkout/api/checkout.api';
import { DEFAULT_LANG } from '@/features/(actors)/auth/constants/auth.constants';

export async function POST(request: NextRequest) {
	try {
		const locale = request.headers.get('x-localization') || DEFAULT_LANG;
		const body = await request.json();

		const { order_id, payment_method, amount } = body;

		if (!order_id || !payment_method || !amount) {
			return NextResponse.json(
				{ error: 'order_id, payment_method, and amount are required' },
				{ status: 400 }
			);
		}

		const result = await processPayment({ order_id, payment_method, amount }, locale);

		return NextResponse.json(result, { status: 200 });
	} catch (error: any) {
		console.error('[Checkout] process-payment error:', error.message);
		return NextResponse.json(
			{ error: error.message || 'Payment failed' },
			{ status: 400 }
		);
	}
}
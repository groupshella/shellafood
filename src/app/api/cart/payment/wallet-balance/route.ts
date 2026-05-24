/**
 * app/api/cart/payment/wallet-balance/route.ts
 * GET /api/cart/payment/wallet-balance
 * → backend: GET /api/v1/customer/info  (reads wallet_balance field)
 */
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { DEFAULT_LANG } from '@/features/auth/constants/auth.constants';

const BACKEND = 'https://shellafood.com';

export async function GET(request: NextRequest) {
    const store = await cookies();
    const auth = store.get('auth_token')?.value;
    const locale = request.headers.get('x-localization') || DEFAULT_LANG;

    if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const res = await fetch(`${BACKEND}/api/v1/customer/info`, {
        headers: {
            Accept: 'application/json',
            'X-localization': locale,
            Authorization: `Bearer ${auth}`,
        },
        cache: 'no-store',
    });

    const data = await res.json().catch(() => ({})) as Record<string, unknown>;
    if (!res.ok) return NextResponse.json({ error: 'Failed to fetch wallet' }, { status: res.status });

    // Only expose what the client needs — never forward the full customer object
    return NextResponse.json({ wallet_balance: Number(data.wallet_balance) || 0 });
}
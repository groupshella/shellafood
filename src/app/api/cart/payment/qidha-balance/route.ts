/**
 * app/api/cart/payment/qidha-balance/route.ts
 * GET /api/cart/payment/qidha-balance
 * → backend: GET /api/qidha-wallet/get-wallet
 */
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND = 'https://shellafood.com';

export async function GET(_request: NextRequest) {
    const store = await cookies();
    const auth = store.get('auth_token')?.value;

    if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const res = await fetch(`${BACKEND}/api/qidha-wallet/get-wallet`, {
        headers: {
            Accept: 'application/json',
            Host: 'shellafood.com',
            Authorization: `Bearer ${auth}`,
        },
        cache: 'no-store',
    });

    const data = await res.json().catch(() => ({})) as Record<string, unknown>;
    if (!res.ok) return NextResponse.json({ error: 'Failed to fetch Qidha wallet' }, { status: res.status });

    return NextResponse.json(data);
}
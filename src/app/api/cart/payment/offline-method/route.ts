/**
 * app/api/cart/payment/offline-methods/route.ts
 * Proxy: GET /api/cart/payment/offline-methods → backend offline_payment_method/list
 */
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { DEFAULT_LANG } from '@/features/auth/constants/auth.constants';

const BACKEND = 'https://shellafood.com';

export async function GET(request: NextRequest) {
    const store = await cookies();
    const auth = store.get('auth_token')?.value;
    const module = store.get('moduleId')?.value || request.headers.get('moduleId') || '3';
    const zone = store.get('zoneId')?.value || request.headers.get('zoneId') || '2';
    const locale = request.headers.get('x-localization') || DEFAULT_LANG;

    if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const res = await fetch(`${BACKEND}/api/v1/offline_payment_method/list`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Host': 'shellafood.com',
            'X-localization': locale,
            'moduleId': module,
            'zoneId': `[${zone}]`,
            Authorization: `Bearer ${auth}`,
        },
        cache: 'no-store',
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
}
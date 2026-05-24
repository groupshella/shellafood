/**
 * app/api/cart/payment/route.ts
 * Proxy: POST /api/cart/payment → backend process-payment
 * Proxy: PUT  /api/cart/payment → backend offline-payment
 */
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { DEFAULT_LANG } from '@/features/auth/constants/auth.constants';

const BACKEND = 'https://shellafood.com';

async function getAuth(request: NextRequest) {
    const store = await cookies();
    const auth = store.get('auth_token')?.value;
    const module = store.get('moduleId')?.value || request.headers.get('moduleId') || '3';
    const zone = store.get('zoneId')?.value || request.headers.get('zoneId') || '2';
    const locale = request.headers.get('x-localization') || DEFAULT_LANG;
    return { auth, module, zone, locale };
}

/** POST → process-payment (wallet / digital) */
export async function POST(request: NextRequest) {
    const { auth, module, zone, locale } = await getAuth(request);
    if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json().catch(() => ({}));
    const res = await fetch(`${BACKEND}/api/v1/customer/order/process-payment`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Host': 'shellafood.com',
            'X-localization': locale,
            'moduleId': module,
            'zoneId': `[${zone}]`,
            Authorization: `Bearer ${auth}`,
        },
        body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
}

/** PUT → offline-payment (attach payment proof) */
export async function PUT(request: NextRequest) {
    const { auth, module, zone, locale } = await getAuth(request);
    if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json().catch(() => ({}));
    const res = await fetch(`${BACKEND}/api/v1/customer/order/offline-payment`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Host': 'shellafood.com',
            'X-localization': locale,
            'moduleId': module,
            'zoneId': `[${zone}]`,
            Authorization: `Bearer ${auth}`,
        },
        body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
}
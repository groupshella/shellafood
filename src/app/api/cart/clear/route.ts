/**
 * app/api/cart/clear/route.ts
 *
 * DELETE /api/cart/clear → clear all items from cart
 * Called by useCart.clearAll()
 */
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { DEFAULT_LANG } from '@/features/auth/constants/auth.constants';

const BACKEND = 'https://shellafood.com';

export async function DELETE(request: NextRequest) {
    const store = await cookies();
    const auth = store.get('auth_token')?.value;
    const guest = store.get('guest_id')?.value;
    const module = store.get('moduleId')?.value || '3';
    const zone = store.get('zoneId')?.value || '2';
    const locale = request.headers.get('x-localization') || DEFAULT_LANG;

    if (!guest) {
        return NextResponse.json({ error: 'Guest ID required' }, { status: 400 });
    }

    const res = await fetch(`${BACKEND}/api/v1/customer/cart/clear`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Host': 'shellafood.com',
            'X-localization': locale,
            'moduleId': module,
            'zoneId': `[${zone}]`,
            ...(auth ? { Authorization: `Bearer ${auth}` } : {}),
        },
        body: JSON.stringify({ guest_id: guest }),
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
}
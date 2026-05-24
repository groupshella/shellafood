/**
 * app/api/cart/route.ts
 *
 * All cart CRUD operations in one file.
 *
 * GET    /api/cart          → list cart items (useCart seed / refetch)
 * POST   /api/cart          → add item to cart
 * PUT    /api/cart          → update item quantity     ← useCart.updateQuantity
 * DELETE /api/cart          → remove single item       ← useCart.removeItem
 */
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { DEFAULT_LANG } from '@/features/auth/constants/auth.constants';

const BACKEND = 'https://shellafood.com';

// ─── Shared header builder ────────────────────────────────────────────────────

async function buildHeaders(request: NextRequest) {
    const store = await cookies();
    const auth = store.get('auth_token')?.value;
    const module = store.get('moduleId')?.value || request.headers.get('moduleId') || '3';
    const zone = store.get('zoneId')?.value || request.headers.get('zoneId') || '2';
    const locale = request.headers.get('x-localization') || DEFAULT_LANG;
    const guest = store.get('guest_id')?.value ?? null;

    return {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Host': 'shellafood.com',
            'X-localization': locale,
            'moduleId': module,
            'zoneId': `[${zone}]`,
            ...(auth ? { Authorization: `Bearer ${auth}` } : {}),
        },
        auth,
        guest,
    };
}

// ─── GET — list cart ──────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
    const { headers, guest } = await buildHeaders(request);

    // guest_id can come from cookie (preferred) or query param (fallback for SSR fetch)
    const guestId = guest ?? request.nextUrl.searchParams.get('guest_id');
    if (!guestId) {
        return NextResponse.json({ error: 'Guest ID required' }, { status: 400 });
    }

    const res = await fetch(`${BACKEND}/api/v1/customer/cart/list?guest_id=${guestId}`, {
        method: 'GET',
        headers,
        cache: 'no-store',
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
}

// ─── POST — add item ──────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
    const { headers, guest } = await buildHeaders(request);
    if (!guest) {
        return NextResponse.json({ error: 'Guest ID required' }, { status: 400 });
    }

    const body = await request.json().catch(() => ({}));

    const res = await fetch(`${BACKEND}/api/v1/customer/cart/add`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ ...body, guest_id: guest }),
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
}

// ─── PUT — update quantity ────────────────────────────────────────────────────
// Called by useCart.updateQuantity({ cart_id, price_at_add, quantity })

export async function PUT(request: NextRequest) {
    const { headers, guest } = await buildHeaders(request);
    if (!guest) {
        return NextResponse.json({ error: 'Guest ID required' }, { status: 400 });
    }

    const body = await request.json().catch(() => ({}));
    // backend expects guest_id in the body
    const res = await fetch(`${BACKEND}/api/v1/customer/cart/update`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ ...body, guest_id: guest }),
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
}

// ─── DELETE — remove single item ──────────────────────────────────────────────
// Called by useCart.removeItem(cartId)
// Query param: ?cart_id=<id>

export async function DELETE(request: NextRequest) {
    const { headers, guest } = await buildHeaders(request);
    if (!guest) {
        return NextResponse.json({ error: 'Guest ID required' }, { status: 400 });
    }

    const cartId = request.nextUrl.searchParams.get('cart_id');
    if (!cartId) {
        return NextResponse.json({ error: 'cart_id is required' }, { status: 400 });
    }

    const res = await fetch(`${BACKEND}/api/v1/customer/cart/remove`, {
        method: 'DELETE',
        headers,
        body: JSON.stringify({ cart_id: cartId, guest_id: guest }),
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
}
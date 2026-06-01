/**
 * Server-side direct API calls to external cart service.
 * Only import this in Route Handlers or Server Components.
 */
import { cookies } from 'next/headers';
import { DEFAULT_LANG } from '@/features/(actors)/auth/constants/auth.constants';

const EXTERNAL_API = 'https://shellafood.com/api/v1/customer/cart';

async function getAuthContext() {
	const cookieStore = await cookies();
	const moduleId = cookieStore.get('moduleId')?.value || '3';
	const zoneId = cookieStore.get('zoneId')?.value || '2';
	const authToken = cookieStore.get('auth_token')?.value || null;
	return { moduleId, zoneId, authToken };
}

function buildHeaders(
	ctx: Awaited<ReturnType<typeof getAuthContext>>,
	locale?: string,
	zoneFormat: 'plain' | 'array' = 'array'
) {
	const zoneId = zoneFormat === 'array' ? `[${ctx.zoneId}]` : ctx.zoneId;
	return {
		'Content-Type': 'application/json',
		Accept: 'application/json',
		Host: 'shellafood.com',
		'X-localization': locale || DEFAULT_LANG,
		moduleId: ctx.moduleId,
		zoneId,
		...(ctx.authToken ? { Authorization: `Bearer ${ctx.authToken}` } : {}),
	};
}

export async function getAllCartItems(guestId: string, locale?: string) {
	const ctx = await getAuthContext();
	const url = `${EXTERNAL_API}/list?guest_id=${encodeURIComponent(guestId)}`;

	const response = await fetch(url, {
		method: 'GET',
		headers: buildHeaders(ctx, locale, 'plain'),
		cache: 'no-store',
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(`Failed to fetch cart: ${response.statusText} — ${errorText}`);
	}

	return response.json();
}

export async function addToCart(body: Record<string, unknown>, locale?: string) {
	const ctx = await getAuthContext();
	const guestId = body.guest_id as string;
	if (!guestId) throw new Error('Guest ID required');

	const url = `${EXTERNAL_API}/add`;
	const response = await fetch(url, {
		method: 'POST',
		headers: buildHeaders(ctx, locale),
		body: JSON.stringify(body),
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(`Failed to add to cart: ${response.statusText} — ${errorText}`);
	}

	return response.json();
}

export async function updateCart(body: Record<string, unknown>, locale?: string) {
	const ctx = await getAuthContext();
	const guestId = body.guest_id as string;
	if (!guestId) throw new Error('Guest ID required');

	const url = `${EXTERNAL_API}/update`;
	const response = await fetch(url, {
		method: 'POST',
		headers: buildHeaders(ctx, locale),
		body: JSON.stringify(body),
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(`Failed to update cart: ${response.statusText} — ${errorText}`);
	}

	return response.json();
}

export async function removeCartItem(cartId: string, guestId: string, locale?: string) {
	const ctx = await getAuthContext();
	const url = `${EXTERNAL_API}/remove-item?cart_id=${encodeURIComponent(cartId)}&guest_id=${encodeURIComponent(guestId)}`;

	const response = await fetch(url, {
		method: 'DELETE',
		headers: buildHeaders(ctx, locale),
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(`Failed to remove item: ${response.statusText} — ${errorText}`);
	}

	return response.json().catch(() => ({ success: true }));
}

export async function clearCart(guestId: string, locale?: string) {
	const ctx = await getAuthContext();
	const url = `${EXTERNAL_API}/remove?guest_id=${encodeURIComponent(guestId)}`;

	const response = await fetch(url, {
		method: 'DELETE',
		headers: buildHeaders(ctx, locale),
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(`Failed to clear cart: ${response.statusText} — ${errorText}`);
	}

	return response.json().catch(() => ({ success: true }));
}
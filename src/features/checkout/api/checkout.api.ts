/**
 * checkout.api.ts
 * Server-side direct API calls to the Laravel backend.
 * Only import this in Route Handlers or Server Components.
 */
import { cookies } from 'next/headers';
import { DEFAULT_LANG } from '@/features/(actors)/auth/constants/auth.constants';
import type {
	PlaceOrderPayload,
	PlaceOrderResponse,
	ProcessPaymentPayload,
	ProcessPaymentResponse,
	DeliveryInfo,
} from '../types/checkout.types'

const BACKEND = 'https://shellafood.com/api/v1/customer/order';

// ─── Auth Context ─────────────────────────────────────────────────────────────

async function getAuthContext() {
	const store = await cookies();
	return {
		moduleId: store.get('moduleId')?.value || '3',
		zoneId: store.get('zoneId')?.value || '2',
		authToken: store.get('auth_token')?.value || null,
	};
}

function buildHeaders(
	ctx: Awaited<ReturnType<typeof getAuthContext>>,
	locale = DEFAULT_LANG
) {
	return {
		'Content-Type': 'application/json',
		Accept: 'application/json',
		'X-localization': locale,
		moduleId: ctx.moduleId,
		zoneId: `[${ctx.zoneId}]`,
		'User-Agent':
			'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
		...(ctx.authToken ? { Authorization: `Bearer ${ctx.authToken}` } : {}),
	};
}

// ─── Place Order ─────────────────────────────────────────────────────────────

export async function placeOrder(
	payload: PlaceOrderPayload,
	locale?: string
): Promise<PlaceOrderResponse> {
	const ctx = await getAuthContext();

	const response = await fetch(`${BACKEND}/place`, {
		method: 'POST',
		headers: buildHeaders(ctx, locale),
		body: JSON.stringify(payload),
		cache: 'no-store',
	});

	if (!response.ok) {
		const err = await response.json().catch(() => ({}));
		const message =
			err?.errors?.[0]?.message ||
			err?.message ||
			`Failed to place order: ${response.statusText}`;
		throw new Error(message);
	}

	return response.json();
}

// ─── Process Payment ──────────────────────────────────────────────────────────

export async function processPayment(
	payload: ProcessPaymentPayload,
	locale?: string
): Promise<ProcessPaymentResponse> {
	const ctx = await getAuthContext();

	const response = await fetch(`${BACKEND}/process-payment`, {
		method: 'POST',
		headers: buildHeaders(ctx, locale),
		body: JSON.stringify(payload),
		cache: 'no-store',
	});

	if (!response.ok) {
		const err = await response.json().catch(() => ({}));
		const message =
			err?.errors?.[0]?.message ||
			err?.message ||
			`Payment failed: ${response.statusText}`;
		throw new Error(message);
	}

	return response.json();
}

// ─── Prepare Payment (delivery fee calculation) ───────────────────────────────

export async function preparePayment(
	payload: PlaceOrderPayload & { payment_method: string },
	locale?: string
): Promise<{ payment_data: DeliveryInfo }> {
	const ctx = await getAuthContext();

	const response = await fetch(`${BACKEND}/prepare-payment`, {
		method: 'POST',
		headers: buildHeaders(ctx, locale),
		body: JSON.stringify(payload),
		cache: 'no-store',
	});

	if (!response.ok) {
		const err = await response.json().catch(() => ({}));
		const message =
			err?.errors?.[0]?.message ||
			err?.message ||
			`Failed to prepare payment: ${response.statusText}`;
		throw new Error(message);
	}

	return response.json();
}

// ─── Get Order Details ────────────────────────────────────────────────────────

export async function getOrderDetails(orderId: number, locale?: string) {
	const ctx = await getAuthContext();

	const response = await fetch(`${BACKEND}/details?order_id=${orderId}`, {
		method: 'GET',
		headers: buildHeaders(ctx, locale),
		cache: 'no-store',
	});

	if (!response.ok) {
		const err = await response.json().catch(() => ({}));
		throw new Error(err?.errors?.[0]?.message || 'Failed to fetch order');
	}

	return response.json();
}
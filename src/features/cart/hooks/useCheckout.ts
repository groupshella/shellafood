'use client';

/**
 * useCheckout — drives the full checkout flow
 *
 * Step 1: POST /api/cart/order          → place order (always)
 * Step 2: branch by paymentMethod
 *   cash      → nothing extra
 *   wallet    → POST /api/cart/payment
 *   kaidha    → POST /api/cart/payment
 *   myfatoorah→ POST /api/cart/payment  → returns paymentUrl (caller redirects)
 *   offline   → PUT  /api/cart/payment
 *
 * Knows nothing about: cart items state, UI, address selection
 */
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { CheckoutOptions, CheckoutResult, PaymentMethod } from '../types/cart.types';

// ─── Types ────────────────────────────────────────────────────────────────────


// ─── API constants ────────────────────────────────────────────────────────────

const PAYMENT_API_VALUE: Record<PaymentMethod, string> = {
  cash: 'cash_on_delivery',
  wallet: 'wallet',
  kaidha: 'wallet_qidha',
  myfatoorah: 'digital_payment',
  offline: 'offline_payment',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2
    + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function sessionNum(key: string): number {
  return parseFloat(sessionStorage.getItem(key) ?? '0') || 0;
}

async function post<T>(path: string, body: unknown): Promise<{ ok: boolean; data: T }> {
  const res = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({})) as T;
  return { ok: res.ok, data };
}

async function put<T>(path: string, body: unknown): Promise<{ ok: boolean; data: T }> {
  const res = await fetch(path, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({})) as T;
  return { ok: res.ok, data };
}

function firstError(data: unknown): string | null {
  if (!data || typeof data !== 'object') return null;
  const d = data as Record<string, unknown>;
  if (Array.isArray(d.errors)) return (d.errors[0] as any)?.message ?? null;
  return (d.error as string) ?? (d.message as string) ?? null;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useCheckout() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const checkout = useCallback(async (opts: CheckoutOptions): Promise<CheckoutResult> => {
    const { items, address, paymentMethod, totals, couponCode, offlineMethodId, offlineNote, offlineFields } = opts;

    // ── guards ───────────────────────────────────────────────────────────────
    if (!items.length) return { success: false, error: 'Cart is empty' };
    if (!address) return { success: false, error: 'No address selected' };

    const storeId = parseInt(items[0].storeId, 10);
    if (!storeId) return { success: false, error: 'Invalid store' };

    setIsProcessing(true);

    try {
      // ── step 1: place order ──────────────────────────────────────────────
      const storeLat = sessionNum('latitude_store');
      const storeLon = sessionNum('longitude_store');
      const addrLat = parseFloat(address.latitude) || 0;
      const addrLon = parseFloat(address.longitude) || 0;

      const { ok: placedOk, data: placedData } = await post<Record<string, unknown>>(
        '/api/cart/order',
        {
          cart: items.map((i) => ({
            item_id: parseInt(i.productId, 10),
            quantity: i.quantity,
            variation: [],
            add_on_ids: [],
            add_on_qtys: [],
          })),
          order_amount: totals.total,
          payment_method: PAYMENT_API_VALUE[paymentMethod],
          order_type: 'delivery',
          store_id: storeId,
          distance: haversineKm(addrLat, addrLon, storeLat, storeLon),
          address: address.address,
          latitude: addrLat,
          longitude: addrLon,
          coupon_code: couponCode ?? '',
          order_note: '',
          delivery_instruction: '',
          ...(address.id ? { delivery_address_id: address.id } : {}),
        },
      );

      if (!placedOk || !placedData.order_id) {
        return { success: false, error: firstError(placedData) ?? 'Failed to place order' };
      }

      const orderId = Number(placedData.order_id);
      const amount = Number(placedData.total_ammount) || totals.total;

      // ── step 2: payment branch ───────────────────────────────────────────
      switch (paymentMethod) {

        case 'cash':
          // order is created unpaid — nothing more to do
          break;

        case 'wallet':
        case 'kaidha': {
          const { ok, data } = await post<Record<string, unknown>>('/api/cart/payment', {
            order_id: orderId,
            payment_method: PAYMENT_API_VALUE[paymentMethod],
            amount,
          });
          if (!ok) return { success: false, error: firstError(data) ?? 'Wallet payment failed' };
          break;
        }

        case 'myfatoorah': {
          const { ok, data } = await post<Record<string, unknown>>('/api/cart/payment', {
            order_id: orderId,
            payment_method: 'digital_payment',
            amount,
          });
          if (!ok || !data.payment_url) {
            return { success: false, error: firstError(data) ?? 'Digital payment failed' };
          }
          // hand URL back to the caller — it handles the redirect
          return { success: true, orderId: String(orderId), paymentUrl: data.payment_url as string };
        }

        case 'offline': {
          if (!offlineMethodId) return { success: false, error: 'Select an offline payment method' };
          const { ok, data } = await put<Record<string, unknown>>('/api/cart/payment', {
            order_id: orderId,
            method_id: offlineMethodId,
            customer_note: offlineNote ?? '',
            ...(offlineFields ?? {}),
          });
          if (!ok) return { success: false, error: firstError(data) ?? 'Offline payment failed' };
          break;
        }
      }

      // ── step 3: go to tracking ───────────────────────────────────────────
      router.push(`/my-orders/${orderId}/track`);
      return { success: true, orderId: String(orderId) };

    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unexpected error';
      return { success: false, error: msg };
    } finally {
      setIsProcessing(false);
    }
  }, [router]);

  return { checkout, isProcessing };
}
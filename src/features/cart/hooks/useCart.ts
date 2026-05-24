'use client';

/**
 * useCart — cart items state + CRUD
 *
 * Owns: items[], isLoading, isUpdating
 * Knows nothing about: payment, address, checkout
 */
import { useState, useEffect, useCallback } from 'react';
import { ApiCartItem, CartItem } from '../types/cart.types';

// ─── Types ────────────────────────────────────────────────────────────────────


// ─── Helpers ──────────────────────────────────────────────────────────────────

function mapApiItems(raw: ApiCartItem[]): CartItem[] {
    if (!Array.isArray(raw)) return [];
    return raw
        .filter((r) => r?.item)
        .map((r) => ({
            id: String(r.id),
            productId: String(r.item_id),
            productName: r.item.name ?? '',
            productImage: r.item.image_full_url || r.item.image || '',
            quantity: Math.max(1, Number(r.quantity) || 1),
            priceAtAdd: Number(r.price) || 0,
            storeId: String(r.item.store_id),
            storeName: r.item.store_name ?? '',
            stock: r.item.stock ?? 0,
            hasDiscount: (Number(r.discount_amount) || 0) > 0,
            discountAmount: Number(r.discount_amount) || 0,
        }));
}

function normalizeRawCart(raw: unknown): ApiCartItem[] {
    if (Array.isArray(raw)) return raw as ApiCartItem[];
    if (raw && typeof raw === 'object') {
        const r = raw as Record<string, unknown>;
        const list = r.cart_items ?? r.data ?? r.cart ?? r.items;
        if (Array.isArray(list)) return list as ApiCartItem[];
    }
    return [];
}

async function apiCall(path: string, options: RequestInit) {
    const res = await fetch(path, options);
    const data = await res.json().catch(() => ({})) as Record<string, unknown>;
    return { ok: res.ok, data };
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useCart(initialData?: unknown) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);

    // Seed from SSR data
    useEffect(() => {
        const list = normalizeRawCart(initialData);
        setItems(mapApiItems(list));
        setIsLoading(false);
    }, [initialData]);

    // ── update quantity ──────────────────────────────────────────────────────────
    const updateQuantity = useCallback(async (
        cartId: string,
        priceAtAdd: number,
        quantity: number,
    ): Promise<boolean> => {
        setIsUpdating(true);
        const { ok } = await apiCall('/api/cart', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cart_id: cartId, price_at_add: priceAtAdd, quantity }),
        });
        if (ok) {
            setItems((prev) => prev.map((i) => i.id === cartId ? { ...i, quantity } : i));
            window.dispatchEvent(new Event('cartUpdated'));
        }
        setIsUpdating(false);
        return ok;
    }, []);

    // ── remove item ─────────────────────────────────────────────────────────────
    const removeItem = useCallback(async (cartId: string): Promise<boolean> => {
        setIsUpdating(true);
        const { ok } = await apiCall(`/api/cart?cart_id=${cartId}`, { method: 'DELETE' });
        if (ok) {
            setItems((prev) => prev.filter((i) => i.id !== cartId));
            window.dispatchEvent(new Event('cartUpdated'));
        }
        setIsUpdating(false);
        return ok;
    }, []);

    // ── clear all ───────────────────────────────────────────────────────────────
    const clearAll = useCallback(async (): Promise<boolean> => {
        setIsUpdating(true);
        const { ok } = await apiCall('/api/cart/clear', { method: 'DELETE' });
        if (ok) {
            setItems([]);
            window.dispatchEvent(new Event('cartUpdated'));
        }
        setIsUpdating(false);
        return ok;
    }, []);

    // ── subtotal (derived — no extra hook needed) ────────────────────────────────
    const subtotal = items.reduce((sum, i) => sum + i.priceAtAdd * i.quantity, 0);
    const itemsCount = items.reduce((sum, i) => sum + i.quantity, 0);

    return {
        items,
        isLoading,
        isUpdating,
        subtotal,
        itemsCount,
        updateQuantity,
        removeItem,
        clearAll,
    };
}
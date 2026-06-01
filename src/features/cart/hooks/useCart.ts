'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useLanguage } from '@/providers';
import { getBaseUrl } from '@/features/(actors)/auth/constants/auth.constants';
import type { CartItem, CartTotals } from '../types/cart.types';
import { mapApiCartToCartItems, calculateTotals } from '../utils/cart.utils';

function getCookie(name: string): string | null {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
}

interface UseCartOptions {
    initialCartData?: any[];
}

export function useCart(options: UseCartOptions = {}) {
    const { initialCartData } = options;
    const { language } = useLanguage();
    const isArabic = language === 'ar';
    const baseUrl = getBaseUrl();

    const [items, setItems] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);

    // ── Init from SSR or localStorage ─────────────────────────────
    useEffect(() => {
        if (initialCartData != null) {
            const rawCart = Array.isArray(initialCartData)
                ? initialCartData
                : [];

            if (Array.isArray(rawCart)) {
                setItems(mapApiCartToCartItems(rawCart));
            }
            setIsLoading(false);
            return;
        }

        const stored = localStorage.getItem('shella_cart_items');
        if (stored) {
            try {
                setItems(JSON.parse(stored));
            } catch {
                setItems([]);
            }
        }
        setIsLoading(false);
    }, [initialCartData]);

    // ── Fetch fresh cart ──────────────────────────────────────────
    const refreshCart = useCallback(async () => {
        const guestId = getCookie('guest_id');
        if (!guestId) return;

        try {
            const response = await fetch(`${baseUrl}/api/cart/list?guest_id=${guestId}`, {
                headers: {
                    Accept: 'application/json',
                    'x-localization': language,
                },
            });
            if (!response.ok) throw new Error('Failed to fetch cart');

            const data = await response.json();
            console.log(data);
            const rawCart = Array.isArray(data) ? data : data?.cart_items ?? data?.data ?? [];
            const mapped = mapApiCartToCartItems(rawCart);
            setItems(mapped);
            localStorage.setItem('shella_cart_items', JSON.stringify(mapped));
        } catch (err) {
            console.error('[useCart] refresh error:', err);
        }
    }, [baseUrl, language]);

    useEffect(() => {
        if (!initialCartData) refreshCart();
    }, [initialCartData, refreshCart]);

    // ── Add to cart ─────────────────────────────────────────────
    const addToCart = useCallback(
        async (params: {
            productId: string;
            quantity?: number;
            priceAtAdd: number;
            variation?: any[];
            add_on_ids?: any[];
            add_on_qtys?: any[];
        }) => {
            setIsUpdating(true);
            try {
                const guestId = getCookie('guest_id');
                if (!guestId) throw new Error('Invalid session');

                const response = await fetch(`${baseUrl}/api/cart/add`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        'x-localization': language,
                    },
                    body: JSON.stringify({
                        item_id: parseInt(params.productId),
                        guest_id: guestId,
                        model: 'Item',
                        price: params.priceAtAdd,
                        quantity: params.quantity || 1,
                        variation: params.variation || [],
                        add_on_ids: params.add_on_ids || [],
                        add_on_qtys: params.add_on_qtys || [],
                    }),
                });

                if (!response.ok) {
                    const err = await response.json().catch(() => ({}));
                    return { success: false, error: err.error || err.message || 'Failed to add' };
                }

                const data = await response.json();
                window.dispatchEvent(new Event('cartUpdated'));
                await refreshCart();
                return { success: true, message: data?.message, data };
            } catch (error: any) {
                return { success: false, error: error?.message || 'Connection error' };
            } finally {
                setIsUpdating(false);
            }
        },
        [baseUrl, language, refreshCart]
    );

    // ── Update quantity ─────────────────────────────────────────
    const updateQuantity = useCallback(
        async (cartId: string, priceAtAdd: number, quantity: number) => {
            setIsUpdating(true);
            try {
                const guestId = getCookie('guest_id');
                if (!guestId) return false;

                const response = await fetch(`${baseUrl}/api/cart/update`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        'x-localization': language,
                    },
                    body: JSON.stringify({
                        cart_id: cartId,
                        price: priceAtAdd,
                        quantity,
                        guest_id: guestId
                    }),
                });

                if (!response.ok) return false;

                setItems((prev) => {
                    const updated = prev.map((i) => (i.id === cartId ? { ...i, quantity } : i));
                    localStorage.setItem('shella_cart_items', JSON.stringify(updated));
                    return updated;
                });
                window.dispatchEvent(new Event('cartUpdated'));
                return true;
            } catch (error) {
                console.error('Error updating quantity:', error);
                return false;
            } finally {
                setIsUpdating(false);
            }
        },
        [baseUrl, language]
    );

    // ── Remove single item ────────────────────────────────────────
    const removeItem = useCallback(
        async (cartId: string) => {
            setIsUpdating(true);
            try {
                const guestId = getCookie('guest_id');
                const response = await fetch(
                    `${baseUrl}/api/cart/remove-item?cart_id=${cartId}&guest_id=${guestId}`,
                    {
                        method: 'DELETE',
                        headers: {
                            Accept: 'application/json',
                            'x-localization': language,
                        },
                    }
                );

                if (!response.ok) return false;

                setItems((prev) => {
                    const updated = prev.filter((i) => i.id !== cartId);
                    localStorage.setItem('shella_cart_items', JSON.stringify(updated));
                    return updated;
                });
                window.dispatchEvent(new Event('cartUpdated'));
                return true;
            } catch (error) {
                console.error('Error removing item:', error);
                return false;
            } finally {
                setIsUpdating(false);
            }
        },
        [baseUrl, language]
    );

    // ── Clear all ─────────────────────────────────────────────────
    const clearAll = useCallback(async () => {
        setIsUpdating(true);
        try {
            const guestId = getCookie('guest_id');
            const response = await fetch(`${baseUrl}/api/cart/remove?guest_id=${guestId}`, {
                method: 'DELETE',
                headers: {
                    Accept: 'application/json',
                    'x-localization': language,
                },
            });

            if (!response.ok) return false;

            setItems([]);
            localStorage.removeItem('shella_cart_items');
            window.dispatchEvent(new Event('cartUpdated'));
            return true;
        } catch (error) {
            console.error('Error clearing cart:', error);
            return false;
        } finally {
            setIsUpdating(false);
        }
    }, [baseUrl, language]);

    // ── Calculations ──────────────────────────────────────────────
    const calculations: CartTotals = useMemo(() => calculateTotals(items), [items]);

    return {
        items,
        isLoading,
        isUpdating,
        isArabic,
        language,
        calculations,
        addToCart,
        updateQuantity,
        removeItem,
        clearAll,
        refreshCart,
    };
}
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useCart } from '@/shared/hooks/useCart';
import type { CartItem } from '../types/cart.types';

interface ApiCartItem {
	id: number;
	item_id: number;
	quantity: number;
	price: number;
	original_price: number;
	discount_amount: number;
	item: {
		id: number;
		name: string;
		image: string;
		image_full_url: string;
		store_id: number;
		store_name: string;
		stock: number;
		unit_type: string;
		discounted_price: number;
		original_price: number;
	};
}

// Helper function to get cookie value
function getCookie(name: string): string | null {
	const value = `; ${document.cookie}`;
	const parts = value.split(`; ${name}=`);
	if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
	return null;
}

function mapApiCartToCartItems(apiCart: ApiCartItem[]): CartItem[] {
	if (!apiCart || !Array.isArray(apiCart)) return [];

	return apiCart
		.filter((cartItem) => cartItem != null && cartItem.item != null)
		.map((cartItem) => {
			const item = cartItem.item!;
			const id = cartItem.id != null ? String(cartItem.id) : '';
			const productId = cartItem.item_id != null ? String(cartItem.item_id) : '';
			const storeId = item.store_id != null ? String(item.store_id) : '';
			const priceAtAdd = Number(cartItem.price) || 0;
			const quantity = Math.max(1, Number(cartItem.quantity) || 0);
			return {
				id,
				productId,
				productName: item.name ?? '',
				productNameAr: item.name ?? '',
				productImage: item.image_full_url || item.image || '',
				quantity,
				priceAtAdd,
				originalPrice: Number(cartItem.original_price) || priceAtAdd,
				storeId,
				storeName: item.store_name ?? '',
				storeNameAr: item.store_name ?? '',
				storeLogo: undefined,
				stock: item.stock ?? 0,
				unit: item.unit_type ?? '',
				unitAr: item.unit_type ?? '',
				hasSpecialOffer: (Number(cartItem.discount_amount) || 0) > 0,
				discountAmount: Number(cartItem.discount_amount) || 0,
			};
		});
}

export function useCartItems(initialCartData?: any[]) {
	const [items, setItems] = useState<CartItem[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isUpdating, setIsUpdating] = useState(false);
	const { removeCartItem, clearCart,updateQuantityItem } = useCart();




	useEffect(() => {
		// Normalize: API may return raw array or wrapped object (e.g. { data: [...] })
		const rawCart =
			initialCartData != null && Array.isArray(initialCartData)
				? initialCartData
				: initialCartData != null && typeof initialCartData === 'object' && !Array.isArray(initialCartData)
					? (initialCartData as Record<string, unknown>).data ??
						(initialCartData as Record<string, unknown>).cart ??
						(initialCartData as Record<string, unknown>).items ??
						[]
					: undefined;

		if (rawCart != null && Array.isArray(rawCart) && rawCart.length >= 0) {
			const mappedItems = mapApiCartToCartItems(rawCart as ApiCartItem[]);
			setItems(mappedItems);
			setIsLoading(false);
		} else {
			// If no initial data, load from localStorage as fallback
			const stored = localStorage.getItem('shella_cart_items');
			if (stored) {
				try {
					setItems(JSON.parse(stored));
				} catch {
					setItems([]);
				}
			}
			setIsLoading(false);
		}
	}, [initialCartData]);

	const updateQuantity = useCallback(async (cartId: string,priceAtAdd: number, quantity: number) => {
		setIsUpdating(true);
		try {
			const guestId = getCookie('guest_id');
			
			if (!guestId) {
				console.error('No guest ID found');
				setIsUpdating(false);
				return false;
			} 


			const result = await updateQuantityItem({
				cart_id: cartId,
				price_at_add: priceAtAdd,
				quantity: quantity,
			});

			if (!result.success) {
				console.error('Failed to update quantity');
				setIsUpdating(false);
				return false;
			}

			// Update local state
			setItems((prev) => {
				const updated = prev.map((i) =>
					i.id === cartId ? { ...i, quantity, id:  cartId } : i
				);
				localStorage.setItem('shella_cart_items', JSON.stringify(updated));
				return updated;
			});

			// Trigger cart update event
			window.dispatchEvent(new Event('cartUpdated'));
			
			setIsUpdating(false);
			return true;
		} catch (error) {
			console.error('Error updating quantity:', error);
			setIsUpdating(false);
			return false;
		}
	}, [items, removeCartItem]);

	const removeItem = useCallback(async (cartId: string) => {
		setIsUpdating(true);
		try {
			// Call API to remove item
			const result = await removeCartItem(cartId);
			
			if (!result.success) {
				console.error('Failed to remove item:', result.error);
				setIsUpdating(false);
				return false;
			}

			// Update local state
			setItems((prev) => {
				const updated = prev.filter((i) => i.id !== cartId);
				localStorage.setItem('shella_cart_items', JSON.stringify(updated));
				return updated;
			});

			setIsUpdating(false);
			return true;
		} catch (error) {
			console.error('Error removing item:', error);
			setIsUpdating(false);
			return false;
		}
	}, [removeCartItem]);

	const clearAll = useCallback(async () => {
		setIsUpdating(true);
		try {
			// Call API to clear cart
			const result = await clearCart();
			
			if (!result.success) {
				console.error('Failed to clear cart:', result.error);
				setIsUpdating(false);
				return false;
			}

			// Update local state
			setItems([]);
			localStorage.removeItem('shella_cart_items');
			
			setIsUpdating(false);
			return true;
		} catch (error) {
			console.error('Error clearing cart:', error);
			setIsUpdating(false);
			return false;
		}
	}, [clearCart]);

	return {
		items,
		isLoading,
		isUpdating,
		updateQuantity,
		removeItem,
		clearAll,
	};
}
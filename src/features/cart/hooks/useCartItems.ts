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
	
	return apiCart.map((cartItem) => ({
		id: cartItem.id.toString(),
		productId: cartItem.item_id.toString(),
		productName: cartItem.item.name,
		productNameAr: cartItem.item.name, // API doesn't separate languages
		productImage: cartItem.item.image_full_url || cartItem.item.image,
		quantity: cartItem.quantity,
		priceAtAdd: cartItem.price,
		originalPrice: cartItem.original_price,
		storeId: cartItem.item.store_id.toString(),
		storeName: cartItem.item.store_name,
		storeNameAr: cartItem.item.store_name,
		storeLogo: undefined,
		stock: cartItem.item.stock,
		unit: cartItem.item.unit_type,
		unitAr: cartItem.item.unit_type,
		hasSpecialOffer: cartItem.discount_amount > 0,
		discountAmount: cartItem.discount_amount,
	}));
}

export function useCartItems(initialCartData?: any[]) {
	const [items, setItems] = useState<CartItem[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isUpdating, setIsUpdating] = useState(false);
	const { removeCartItem, clearCart,updateQuantityItem } = useCart();




	useEffect(() => {
		// Use initialCartData from API if available
		if (initialCartData && Array.isArray(initialCartData)) {
			const mappedItems = mapApiCartToCartItems(initialCartData);
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
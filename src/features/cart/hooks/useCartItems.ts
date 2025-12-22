'use client';

import { useState, useEffect, useCallback } from 'react';
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

	useEffect(() => {
		// Use initialCartData from API if available, otherwise load from localStorage
		if (initialCartData && Array.isArray(initialCartData)) {
			const mappedItems = mapApiCartToCartItems(initialCartData);
			setItems(mappedItems);
		} else {
			const stored = localStorage.getItem('shella_cart_items');
			if (stored) {
				try {
					setItems(JSON.parse(stored));
				} catch {
					setItems([]);
				}
			}
		}
		setIsLoading(false);
	}, [initialCartData]);

	const updateQuantity = useCallback(async (itemId: string, quantity: number) => {
		setIsUpdating(true);
		setItems((prev) => {
			const updated = prev.map((item) =>
				item.id === itemId ? { ...item, quantity } : item
			);
			localStorage.setItem('shella_cart_items', JSON.stringify(updated));
			return updated;
		});
		setIsUpdating(false);
	}, []);

	const removeItem = useCallback(async (itemId: string) => {
		setIsUpdating(true);
		setItems((prev) => {
			const updated = prev.filter((item) => item.id !== itemId);
			localStorage.setItem('shella_cart_items', JSON.stringify(updated));
			return updated;
		});
		setIsUpdating(false);
	}, []);

	const clearAll = useCallback(async () => {
		setIsUpdating(true);
		setItems([]);
		localStorage.removeItem('shella_cart_items');
		setIsUpdating(false);
	}, []);

	return {
		items,
		isLoading,
		isUpdating,
		updateQuantity,
		removeItem,
		clearAll,
	};
}


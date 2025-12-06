'use client';

import { useState, useEffect, useCallback } from 'react';
import type { CartItem } from '../types/cart.types';

export function useCartItems() {
	const [items, setItems] = useState<CartItem[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isUpdating, setIsUpdating] = useState(false);

	useEffect(() => {
		// Load from localStorage
		const stored = localStorage.getItem('shella_cart_items');
		if (stored) {
			try {
				setItems(JSON.parse(stored));
			} catch {
				setItems([]);
			}
		}
		setIsLoading(false);
	}, []);

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


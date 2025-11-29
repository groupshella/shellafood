// Hook for managing cart items

import { useState, useEffect, useCallback } from 'react';
import { CartItem } from '../types/cart.types';
import { cartStorageService } from '../services/cartStorage.service';
import { cartEventsService } from '../services/cartEvents.service';

/**
 * Hook for managing cart items
 */
export const useCartItems = () => {
	const [items, setItems] = useState<CartItem[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isUpdating, setIsUpdating] = useState(false);

	// Load items from storage
	useEffect(() => {
		let mounted = true;

		const loadItems = () => {
			try {
				const storedItems = cartStorageService.getItems();
				if (mounted) {
					setItems(storedItems);
				}
			} catch (error) {
				console.error('Failed to load cart items:', error);
				if (mounted) {
					setItems([]);
				}
			} finally {
				if (mounted) {
					setIsLoading(false);
				}
			}
		};

		// Initial load with delay for realistic loading
		const timeoutId = setTimeout(() => {
			loadItems();
		}, 500);

		// Listen for cart updates
		const handleCartUpdate = () => {
			if (mounted) {
				loadItems();
			}
		};

		cartEventsService.subscribe(handleCartUpdate);

		return () => {
			mounted = false;
			clearTimeout(timeoutId);
			cartEventsService.unsubscribe(handleCartUpdate);
		};
	}, []);

	// Update item quantity
	const updateQuantity = useCallback(async (
		itemId: string,
		newQuantity: number
	): Promise<void> => {
		// Optimistic update
		setItems(prev =>
			prev.map(item =>
				item.id === itemId
					? { ...item, quantity: newQuantity }
					: item
			)
		);

		setIsUpdating(true);

		try {
			// Update storage
			await cartStorageService.updateItemQuantity(itemId, newQuantity);

			// Emit event
			cartEventsService.emit();
		} catch (error) {
			console.error('Failed to update quantity:', error);
			// Revert on error
			const storedItems = cartStorageService.getItems();
			setItems(storedItems);
			throw error;
		} finally {
			setIsUpdating(false);
		}
	}, []);

	// Remove item
	const removeItem = useCallback(async (itemId: string): Promise<void> => {
		setIsUpdating(true);

		try {
			// Optimistic update
			setItems(prev => prev.filter(item => item.id !== itemId));

			// Update storage
			await cartStorageService.removeItem(itemId);

			// Emit event
			cartEventsService.emit();
		} catch (error) {
			console.error('Failed to remove item:', error);
			// Revert on error
			const storedItems = cartStorageService.getItems();
			setItems(storedItems);
			throw error;
		} finally {
			setIsUpdating(false);
		}
	}, []);

	// Clear all items
	const clearAll = useCallback(async (): Promise<void> => {
		setIsUpdating(true);

		try {
			// Optimistic update
			setItems([]);

			// Update storage
			await cartStorageService.clearCart();

			// Emit event
			cartEventsService.emit();
		} catch (error) {
			console.error('Failed to clear cart:', error);
			// Revert on error
			const storedItems = cartStorageService.getItems();
			setItems(storedItems);
			throw error;
		} finally {
			setIsUpdating(false);
		}
	}, []);

	return {
		items,
		isLoading,
		isUpdating,
		updateQuantity,
		removeItem,
		clearAll,
	};
};


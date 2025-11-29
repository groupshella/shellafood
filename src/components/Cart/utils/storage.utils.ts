// Storage utilities (wrapper around existing cartStorage)

import { CartItem } from '../types/cart.types';
import { CART_CONSTANTS } from '../constants/cart.constants';

/**
 * Get cart items from localStorage
 */
export const getCartItemsFromStorage = (): CartItem[] => {
	if (typeof window === 'undefined') return [];

	try {
		const stored = localStorage.getItem(CART_CONSTANTS.STORAGE_KEY);
		if (!stored) return [];
		return JSON.parse(stored);
	} catch (error) {
		console.error('Error reading cart from localStorage:', error);
		return [];
	}
};

/**
 * Save cart items to localStorage
 */
export const saveCartItemsToStorage = (items: CartItem[]): void => {
	if (typeof window === 'undefined') return;

	try {
		localStorage.setItem(CART_CONSTANTS.STORAGE_KEY, JSON.stringify(items));
		// Dispatch custom event for cart updates
		window.dispatchEvent(new CustomEvent('cartUpdated'));
	} catch (error) {
		console.error('Error saving cart to localStorage:', error);
	}
};


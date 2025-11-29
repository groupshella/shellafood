// Cart storage service - abstraction over localStorage

import { CartItem } from '../types/cart.types';
import { getCartItemsFromStorage, saveCartItemsToStorage } from '../utils/storage.utils';

class CartStorageService {
	/**
	 * Get all cart items from storage
	 */
	getItems(): CartItem[] {
		return getCartItemsFromStorage();
	}

	/**
	 * Save items to storage
	 */
	private saveItems(items: CartItem[]): void {
		saveCartItemsToStorage(items);
	}

	/**
	 * Update item quantity
	 */
	async updateItemQuantity(itemId: string, quantity: number): Promise<void> {
		const items = this.getItems();
		const itemIndex = items.findIndex((i) => i.id === itemId);

		if (itemIndex < 0) {
			throw new Error('Item not found');
		}

		if (quantity <= 0) {
			items.splice(itemIndex, 1);
		} else {
			items[itemIndex].quantity = quantity;
		}

		this.saveItems(items);
	}

	/**
	 * Remove item from cart
	 */
	async removeItem(itemId: string): Promise<void> {
		const items = this.getItems();
		const filteredItems = items.filter((item) => item.id !== itemId);
		this.saveItems(filteredItems);
	}

	/**
	 * Clear all items
	 */
	async clearCart(): Promise<void> {
		this.saveItems([]);
	}

	/**
	 * Add item to cart
	 */
	async addItem(item: Omit<CartItem, 'id'>): Promise<{ success: boolean; message: string; requiresClearCart?: boolean }> {
		const items = this.getItems();

		// Check if cart has items from different store
		if (items.length > 0 && items[0].storeId !== item.storeId) {
			return {
				success: false,
				message: 'You have items from a different store in your cart. Please clear cart first.',
				requiresClearCart: true,
			};
		}

		// Check if item already exists
		const existingItemIndex = items.findIndex(
			(i) => i.productId === item.productId && i.storeId === item.storeId
		);

		if (existingItemIndex >= 0) {
			// Update quantity
			items[existingItemIndex].quantity += item.quantity;
		} else {
			// Add new item
			const newItem: CartItem = {
				...item,
				id: `cart_${Date.now()}_${Math.random().toString(36).substring(7)}`,
			};
			items.push(newItem);
		}

		this.saveItems(items);
		return {
			success: true,
			message: 'Product added to cart successfully',
		};
	}
}

export const cartStorageService = new CartStorageService();


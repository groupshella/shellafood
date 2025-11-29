// Store grouping utilities

import { CartItem, GroupedItems } from '../types/cart.types';

/**
 * Group cart items by store
 */
export const groupItemsByStore = (items: CartItem[]): GroupedItems => {
	return items.reduce((groups, item) => {
		const storeId = item.storeId;

		if (!groups[storeId]) {
			groups[storeId] = {
				store: {
					id: item.storeId,
					name: item.storeName,
					nameAr: item.storeNameAr,
					logo: item.storeLogo,
				},
				items: [],
			};
		}

		groups[storeId].items.push(item);
		return groups;
	}, {} as GroupedItems);
};

/**
 * Get total items count across all stores
 */
export const getTotalItemsCount = (items: CartItem[]): number => {
	return items.reduce((sum, item) => sum + item.quantity, 0);
};


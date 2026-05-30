import type { CartItem, GroupedItems } from "../../types/cart.types";

/**
 * Groups cart items by store
 * @param items - Array of cart items
 * @returns Grouped items object keyed by store ID
 */
export function groupItemsByStore(items: CartItem[]): GroupedItems {
	const grouped: GroupedItems = {};
	
	items.forEach((item) => {
		if (!grouped[item.storeId]) {
			grouped[item.storeId] = {
				store: {
					id: item.storeId,
					name: item.storeName,
					nameAr: item.storeNameAr,
					logo: item.storeLogo,
				},
				items: [],
			};
		}
		grouped[item.storeId].items.push(item);
	});
	
	return grouped;
}


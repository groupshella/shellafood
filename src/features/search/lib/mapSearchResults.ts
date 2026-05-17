import type { Product } from "@/shared/components";
import type { ApiStore } from "@/features/home/types/store.types";
import type { ItemOrStoreSearchItem, ItemOrStoreSearchStore } from "../types";

export function mapSearchItemToProduct(item: ItemOrStoreSearchItem): Product {
	return {
		id: String(item.id),
		name: item.name,
		image: item.image_full_url,
		price: item.price,
		rating: item.avg_rating,
		reviewsCount: item.rating_count,
		storeId: item.store?.id != null ? String(item.store.id) : undefined,
		inStock: true,
	};
}

/** Maps API store rows to ApiStore for StoreCard (fills required fields with safe defaults). */
export function mapSearchStoreToApiStore(
	store: ItemOrStoreSearchStore,
	moduleId = 3,
): ApiStore {
	return {
		id: store.id,
		name: store.name,
		module_id: store.module_id ?? moduleId,
		is_open: store.is_open ?? store.open === 1,
		open: store.open ?? 1,
		phone: "",
		email: null,
		logo: null,
		logo_full_url: store.logo_full_url ?? null,
		cover_photo: null,
		cover_photo_full_url: store.cover_photo_full_url ?? null,
		address: "",
		latitude: null,
		longitude: null,
		minimum_order: 0,
		delivery_time: store.delivery_time ?? null,
		rating: [],
		avg_rating: store.avg_rating ?? 0,
		rating_count: store.rating_count ?? 0,
		order_count: 0,
		free_delivery: false,
		minimum_shipping_charge: store.minimum_shipping_charge ?? 0,
		featured: 0,
		zone_id: 2,
		active: true,
		veg: 0,
		non_veg: 0,
		badges: [],
		tags: [],
		delivery: {
			delivery_available: true,
			delivery_time_range: store.delivery_time ?? null,
			minimum_delivery_time: null,
			maximum_delivery_time: null,
			delivery_radius: 0,
			delivery_fee: store.minimum_shipping_charge ?? 0,
			free_delivery_threshold: null,
			takeaway_available: false,
			takeaway_time: "",
			dine_in_available: false,
			preparation_time: "",
			estimated_wait_time: null,
		},
		status: {
			is_open: store.is_open ?? true,
			is_busy: false,
			busy_level: "normal",
			current_orders: 0,
			estimated_wait_time: null,
			next_available_slot: null,
			delivery_available: true,
			takeaway_available: false,
			last_updated: "",
		},
		slug: null,
	};
}

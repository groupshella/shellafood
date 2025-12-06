/**
 * Home Feature Types
 * Type definitions for home-related entities
 */

export interface Category {
	id: string;
	name: string;
	description?: string;
	image: string;
	path: string;
	slug?: string;
}

export interface Store {
	id: string;
	name: string;
	nameAr?: string;
	logo?: string;
	rating?: number;
	deliveryTime?: string;
	deliveryFee?: number;
	minOrder?: number;
	isOpen?: boolean;
	distance?: number;
	tags?: string[];
}

export interface Product {
	id: string;
	name: string;
	nameAr?: string;
	image: string;
	price: number;
	originalPrice?: number;
	badge?: string;
	inStock?: boolean;
	rating?: number;
	storeId?: string;
	storeName?: string;
}

export interface DeliveryAddress {
	id: string;
	label: string;
	address: string;
	coordinates?: {
		lat: number;
		lng: number;
	};
	isDefault?: boolean;
}

export interface HomePageData {
	categories: Category[];
	stores: Store[];
	products: Product[];
	selectedAddress?: DeliveryAddress;
}


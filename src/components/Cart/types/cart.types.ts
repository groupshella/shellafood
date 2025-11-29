// Cart-related type definitions

// CartItem matches the existing CartProductItem structure
export interface CartItem {
	id: string;
	productId: string;
	productName: string;
	productNameAr?: string;
	productImage?: string;
	quantity: number;
	priceAtAdd: number;
	storeId: string;
	storeName: string;
	storeNameAr?: string;
	storeLogo?: string;
	stock?: number;
	hasSpecialOffer?: boolean;
}

export interface CartState {
	items: CartItem[];
	selectedAddressId: string | null;
	selectedPaymentMethod: PaymentMethod | null;
	appliedCoupon: Coupon | null;
	isLoading: boolean;
	isUpdating: boolean;
	isProcessing: boolean;
}

export interface CartTotals {
	subtotal: number;
	deliveryFee: number;
	discount: number;
	total: number;
	itemsCount: number;
}

export interface GroupedItems {
	[storeId: string]: {
		store: {
			id: string;
			name: string;
			nameAr?: string;
			logo?: string;
		};
		items: CartItem[];
	};
}

// Import and re-export from payment types
import type { PaymentMethod } from './payment.types';
export type { PaymentMethod };
// Import and re-export from coupon types
import type { Coupon } from './coupon.types';
export type { Coupon };


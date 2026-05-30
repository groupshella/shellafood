/**
 * Cart Feature Types
 * All types for cart feature
 */

// ============================================================================
// Cart Item Types
// ============================================================================

export interface CartItem {
	id: string;
	productId: string;
	productName: string;
	productNameAr?: string;
	productImage?: string;
	quantity: number;
	priceAtAdd: number;
	originalPrice?: number;
	storeId: string;
	storeName: string;
	storeNameAr?: string;
	storeLogo?: string;
	stock?: number;
	unit?: string;
	unitAr?: string;
	hasSpecialOffer?: boolean;
	discountAmount?: number;
}

// ============================================================================
// Cart State Types
// ============================================================================

export interface CartState {
	items: CartItem[];
	selectedAddressId: number | null;
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
	remainingForFreeDelivery?: number;
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

// ============================================================================
// Address Types
// ============================================================================

export interface Address {
	id: number;
	address: string;
	formattedAddress?: string;
	createdAt: string;
	lat?: number;
	lng?: number;
}

// ============================================================================
// Payment Types
// ============================================================================

export type PaymentMethod = 'cash' | 'wallet' | 'kaidha' | 'myfatoorah' | 'offline';

export interface CardDetails {
	number: string;
	expiry: string;
	cvv: string;
	name: string;
}

export interface PaymentOption {
	id: PaymentMethod;
	labelEn: string;
	labelAr: string;
	icon: string;
	descriptionEn?: string;
	descriptionAr?: string;
	requiresDetails: boolean;
}

// ============================================================================
// Coupon Types
// ============================================================================

export interface Coupon {
	id: string;
	code: string;
	titleEn: string;
	titleAr?: string;
	discountValue: number;
	discountType: 'percentage' | 'fixed';
}

// ============================================================================
// API Response Types
// ============================================================================

export interface CartResponse {
	success: boolean;
	data: {
		items: CartItem[];
		totals: CartTotals;
	};
	message?: string;
}

export interface CheckoutResponse {
	success: boolean;
	data: {
		orderId: string;
		orderNumber: string;
		total: number;
	};
	message?: string;
}

export interface CouponResponse {
	success: boolean;
	data: Coupon | null;
	message?: string;
}

// ============================================================================
// Checkout Data Type
// ============================================================================

export interface CheckoutData {
	addressId: number;
	paymentMethod: PaymentMethod;
	totals: CartTotals;
	couponCode?: string;
	cardDetails?: CardDetails;
}




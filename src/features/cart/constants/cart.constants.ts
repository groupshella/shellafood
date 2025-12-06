/**
 * Cart Feature Constants
 * All constants for cart feature
 */

// ============================================================================
// Storage Keys
// ============================================================================

export const STORAGE_KEYS = {
	CART_ITEMS: 'shella_cart_items',
} as const;

// ============================================================================
// Cart Configuration
// ============================================================================

export const CART_CONFIG = {
	DELIVERY_FEE: 10,
	FREE_DELIVERY_THRESHOLD: 100,
	CURRENCY: 'SAR',
	MAX_QUANTITY: 99,
	MIN_QUANTITY: 1,
	ESTIMATED_DELIVERY_MIN_HOURS: 2,
	ESTIMATED_DELIVERY_MAX_HOURS: 4,
} as const;

// ============================================================================
// Language & API
// ============================================================================

export const DEFAULT_LANG = 'ar';

export const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// ============================================================================
// API Endpoints
// ============================================================================

export const CART_ENDPOINTS = {
	GET_CART: '/cart',
	ADD_ITEM: '/cart/items',
	UPDATE_ITEM: '/cart/items',
	REMOVE_ITEM: '/cart/items',
	CLEAR_CART: '/cart',
	CHECKOUT: '/checkout',
	APPLY_COUPON: '/checkout/coupon/apply',
	REMOVE_COUPON: '/checkout/coupon/remove',
} as const;


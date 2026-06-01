/**
 * Cart Feature Constants
 */

export const STORAGE_KEYS = {
    CART_ITEMS: 'shella_cart_items',
} as const;

export const CART_CONFIG = {
    DELIVERY_FEE: 0,
    FREE_DELIVERY_THRESHOLD: 0,
    CURRENCY: 'SAR',
    MAX_QUANTITY: 99,
    MIN_QUANTITY: 1,
    ESTIMATED_DELIVERY_MIN_HOURS: 2,
    ESTIMATED_DELIVERY_MAX_HOURS: 4,
} as const;

export const DEFAULT_LANG = 'ar';
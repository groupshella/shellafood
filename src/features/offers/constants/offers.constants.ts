/**
 * Offers Feature Constants
 */

export const OFFERS_CONSTANTS = {
	BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://shellafood.com',
	DEFAULT_LANG: 'ar',
	
	// Categories
	CATEGORIES: ['all', 'delivery', 'food', 'service', 'general'] as const,
	
	// Promo code copy timeout
	PROMO_COPY_TIMEOUT: 2000, // 2 seconds
} as const;


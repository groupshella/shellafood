/**
 * Orders Feature Constants
 */

export const ORDERS_CONSTANTS = {
	BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://shellafood.com',
	DEFAULT_LANG: 'ar',
	
	// Pagination
	DEFAULT_PAGE_SIZE: 10,
	MAX_PAGE_SIZE: 50,
	
	// Refresh
	PULL_TO_REFRESH_THRESHOLD: 80,
	
	// Virtualization
	ITEM_HEIGHT: 200,
	OVERSCAN: 5,
} as const;


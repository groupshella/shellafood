/**
 * Order Tracking Feature Constants
 */

export const ORDER_TRACKING_CONSTANTS = {
	BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://shellafood.com',
	DEFAULT_LANG: 'ar',
	
	// Notification timeout
	NOTIFICATION_TIMEOUT_MS: 3000,
	
	// Polling intervals (in milliseconds)
	POLLING_INTERVALS: {
		ACTIVE: 5000, // 5 seconds for active orders
		INACTIVE: 30000, // 30 seconds for inactive orders
	},
	
	// Map settings
	MAP: {
		DEFAULT_ZOOM: 15,
		DRIVER_ZOOM: 16,
	},
} as const;


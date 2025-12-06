/**
 * Landing Page Feature Constants
 */

export const LANDING_PAGE_CONSTANTS = {
	BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://shellafood.com',
	DEFAULT_LANG: 'ar',
	
	// Animation durations
	ANIMATION_DURATION: {
		fast: 0.2,
		normal: 0.3,
		slow: 0.5,
	},
	
	// Statistics
	STATS: {
		ORDERS: {
			value: 2000000,
			label: 'Orders',
			labelAr: 'طلب',
		},
		RATING: {
			value: 4.8,
			label: 'Rating',
			labelAr: 'تقييم',
		},
		PARTNERS: {
			value: 5000,
			label: 'Partners',
			labelAr: 'شريك',
		},
		DRIVERS: {
			value: 10000,
			label: 'Drivers',
			labelAr: 'سائق',
		},
	},
} as const;


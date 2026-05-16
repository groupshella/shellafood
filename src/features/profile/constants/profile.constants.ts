/**
 * Profile Feature Constants
 */

export const PROFILE_CONSTANTS = {
	BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://shellafood.com',
	DEFAULT_LANG: 'ar',

	// Notification timeout
	NOTIFICATION_TIMEOUT_MS: 3000,

	// Storage keys
	USER_STORAGE_KEY: 'shella_user',
	ADDRESSES_STORAGE_KEY: 'shella_addresses',

	// Pagination
	DEFAULT_PAGE_SIZE: 10,
} as const;


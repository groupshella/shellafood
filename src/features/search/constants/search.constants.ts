/**
 * Search Feature Constants
 */

export const SEARCH_CONSTANTS = {
	BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://shellafood.com',
	DEFAULT_LANG: 'ar',
	
	// Debounce delay for search input
	DEBOUNCE_DELAY: 300, // milliseconds
	
	// Search history
	SEARCH_HISTORY_KEY: 'shella_search_history',
	MAX_HISTORY_ITEMS: 10,
	
	// Default filters
	DEFAULT_SORT_BY: 'relevance' as const,
} as const;


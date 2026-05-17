/**
 * Search Feature Constants
 */

export const SEARCH_CONSTANTS = {
	BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || "https://shellafood.com",
	DEFAULT_LANG: "ar",

	/** Matches backend defaults used across store listing APIs */
	DEFAULT_ZONE_ID: "[2]",
	DEFAULT_MODULE_ID: "3",
	DEFAULT_LATITUDE: "24.567752",
	DEFAULT_LONGITUDE: "46.5444937",

	DEBOUNCE_DELAY: 300,
	SEARCH_HISTORY_KEY: "shella_search_history",
	MAX_HISTORY_ITEMS: 10,
	DEFAULT_SORT_BY: "relevance" as const,
} as const;

/**
 * Home Feature Constants
 */

export const HOME_CONSTANTS = {
	// Scroll behavior
	SCROLL_TO_TOP_THRESHOLD: 400,



	// Animation durations
	ANIMATION_DURATION: {
		FAST: 0.2,
		NORMAL: 0.3,
		SLOW: 0.5,
	},

	// Cart update event
	CART_UPDATE_EVENT: "cartUpdated",
} as const;


type StoreEndpoint =
	| "latest"
	| "popular"
	| "recommended"
	| "discounted"
	| "top-rated"
	| "top-offer";

/** Next.js route per list type (each has its own `route.ts` + proxy config) */
export const ENDPOINT_API_PATH: Record<StoreEndpoint, string> = {
	latest: "/api/stores/latest",
	popular: "/api/stores/popular",
	recommended: "/api/stores/recommended",
	discounted: "/api/stores/discounted",
	"top-rated": "/api/stores/top-rated",
	"top-offer": "/api/stores/top-offer",
};


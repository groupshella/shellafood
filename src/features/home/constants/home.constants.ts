/**
 * Home Feature Constants
 */

export const HOME_CONSTANTS = {
	// Scroll behavior
	SCROLL_TO_TOP_THRESHOLD: 400,
	
	// Prefetch routes
	PREFETCH_ROUTES: [
		"/categories",
		"/nearby-stores",
		"/discounts",
		"/popular-stores",
		"/previously-ordered-stores",
	],
	
	// Animation durations
	ANIMATION_DURATION: {
		FAST: 0.2,
		NORMAL: 0.3,
		SLOW: 0.5,
	},
	
	// Cart update event
	CART_UPDATE_EVENT: "cartUpdated",
} as const;


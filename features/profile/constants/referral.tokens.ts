/**
 * Invite friends UI tokens mapped to Tailwind design tokens.
 * Prefer these class names over hardcoded hex in referral UI.
 */
export const REFERRAL_UI = {
	textPrimary: "text-foreground",
	textInactiveTab: "text-foreground",
	green: "bg-brand",
	textGreen: "text-brand",
	greenLight: "bg-brand",
	greenPale: "bg-brand/10",
	graySegment: "bg-card",
	grayBorderDashed: "border-border",
	grayLabel: "text-muted",
	/** Decorative pending chip accent (illustration), not UI chrome. */
	purplePending: "#DFD3F5",
	copyIcon: "text-foreground",
	iconStroke: 1.75,
} as const;

import type { Coupon } from '../../types/cart.types';

export interface CouponValidationResult {
	valid: boolean;
	coupon?: Coupon;
	error?: string;
}

/**
 * Mock coupon data - Replace with actual API call
 */
const MOCK_COUPONS: Record<string, Coupon> = {
	SAVE10: {
		id: "1",
		code: "SAVE10",
		titleEn: "Save 10%",
		titleAr: "وفر 10%",
		discountValue: 10,
		discountType: "percentage",
	},
	FIXED20: {
		id: "2",
		code: "FIXED20",
		titleEn: "20 SAR Off",
		titleAr: "خصم 20 ريال",
		discountValue: 20,
		discountType: "fixed",
	},
	WELCOME15: {
		id: "3",
		code: "WELCOME15",
		titleEn: "Welcome 15%",
		titleAr: "ترحيب 15%",
		discountValue: 15,
		discountType: "percentage",
	},
};

/**
 * Validates a coupon code
 * @param code - The coupon code to validate
 * @returns Promise with validation result
 */
export async function validateCoupon(code: string): Promise<CouponValidationResult> {
	// Simulate API call delay
	await new Promise((resolve) => setTimeout(resolve, 800));

	const normalizedCode = code.toUpperCase().trim();
	const coupon = MOCK_COUPONS[normalizedCode];

	if (coupon) {
		return { valid: true, coupon };
	}

	return { 
		valid: false, 
		error: "Invalid or expired coupon" 
	};
}

/**
 * Get available coupon codes for hints
 */
export function getAvailableCouponCodes(): string[] {
	return Object.keys(MOCK_COUPONS);
}


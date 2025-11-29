// Coupon-related type definitions

export interface Coupon {
	id: string;
	code: string;
	titleEn: string;
	titleAr?: string;
	discountValue: number;
	discountType: 'percentage' | 'fixed';
}


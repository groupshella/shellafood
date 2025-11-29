// Mock coupons data

import { Coupon } from '../types/coupon.types';

export const MOCK_COUPONS: Record<string, Coupon> = {
	SAVE10: {
		id: '1',
		code: 'SAVE10',
		titleEn: 'Save 10%',
		titleAr: 'وفر 10%',
		discountValue: 10,
		discountType: 'percentage',
	},
	FIXED20: {
		id: '2',
		code: 'FIXED20',
		titleEn: '20 SAR Off',
		titleAr: 'خصم 20 ريال',
		discountValue: 20,
		discountType: 'fixed',
	},
	WELCOME15: {
		id: '3',
		code: 'WELCOME15',
		titleEn: 'Welcome 15%',
		titleAr: 'ترحيب 15%',
		discountValue: 15,
		discountType: 'percentage',
	},
};


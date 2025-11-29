// Hook for coupon management

import { useState, useCallback } from 'react';
import { Coupon } from '../types/coupon.types';
import { MOCK_COUPONS } from '../constants/coupons.constants';

/**
 * Hook for coupon management
 */
export const useCoupon = () => {
	const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
	const [isValidating, setIsValidating] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const validateCoupon = useCallback(async (code: string): Promise<boolean> => {
		setIsValidating(true);
		setError(null);

		try {
			// Simulate API call
			await new Promise(resolve => setTimeout(resolve, 800));

			// Check mock coupons
			const coupon = Object.values(MOCK_COUPONS).find(
				c => c.code.toUpperCase() === code.toUpperCase()
			);

			if (!coupon) {
				setError('Invalid or expired coupon');
				return false;
			}

			setAppliedCoupon(coupon as Coupon);
			return true;
		} catch (err) {
			setError('Failed to validate coupon');
			return false;
		} finally {
			setIsValidating(false);
		}
	}, []);

	const removeCoupon = useCallback(() => {
		setAppliedCoupon(null);
		setError(null);
	}, []);

	return {
		appliedCoupon,
		isValidating,
		error,
		validateCoupon,
		removeCoupon,
	};
};


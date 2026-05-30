'use client';

import { useState, useCallback } from 'react';
import type { Coupon } from '../types/cart.types';
import { validateCoupon } from '../lib/services/coupon.service';

export interface UseCouponReturn {
	appliedCoupon: Coupon | null;
	isApplying: boolean;
	error: string | null;
	applyCoupon: (code: string) => Promise<boolean>;
	removeCoupon: () => void;
	clearError: () => void;
}

export function useCoupon(): UseCouponReturn {
	const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
	const [isApplying, setIsApplying] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const applyCoupon = useCallback(async (code: string): Promise<boolean> => {
		const normalizedCode = code.trim().toUpperCase();
		
		if (!normalizedCode) {
			setError("Please enter a coupon code");
			return false;
		}

		setIsApplying(true);
		setError(null);

		try {
			const result = await validateCoupon(normalizedCode);
			
			if (result.valid && result.coupon) {
				setAppliedCoupon(result.coupon);
				return true;
			}

			setError(result.error || "Invalid or expired coupon");
			return false;
		} catch (err) {
			setError("An error occurred. Please try again.");
			return false;
		} finally {
			setIsApplying(false);
		}
	}, []);

	const removeCoupon = useCallback(() => {
		setAppliedCoupon(null);
		setError(null);
	}, []);

	const clearError = useCallback(() => {
		setError(null);
	}, []);

	return {
		appliedCoupon,
		isApplying,
		error,
		applyCoupon,
		removeCoupon,
		clearError,
	};
}

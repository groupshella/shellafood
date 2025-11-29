// Hook for cart calculations

import { useMemo } from 'react';
import { CartItem, Coupon, CartTotals } from '../types/cart.types';
import { calculateCartTotals, calculateFreeDeliveryProgress } from '../utils/pricing.utils';

/**
 * Hook for cart calculations
 */
export const useCartCalculations = (
	items: CartItem[],
	coupon: Coupon | null
) => {
	const totals = useMemo<CartTotals>(() => {
		return calculateCartTotals(items, coupon);
	}, [items, coupon]);

	const freeDeliveryProgress = useMemo(() => {
		return calculateFreeDeliveryProgress(totals.subtotal);
	}, [totals.subtotal]);

	const hasFreeDelivery = useMemo(() => {
		return freeDeliveryProgress >= 100;
	}, [freeDeliveryProgress]);

	return {
		...totals,
		freeDeliveryProgress,
		hasFreeDelivery,
	};
};


'use client';

import { useMemo } from 'react';
import type { CartItem, Coupon, CartTotals } from '../types/cart.types';
import { CART_CONFIG } from '../constants/cart.constants';

export function useCartCalculations(items: CartItem[], coupon: Coupon | null): CartTotals {
	return useMemo(() => {
		const subtotal = items.reduce((sum, item) => sum + item.priceAtAdd * item.quantity, 0);
		const deliveryFee = subtotal >= CART_CONFIG.FREE_DELIVERY_THRESHOLD ? 0 : CART_CONFIG.DELIVERY_FEE;
		
		let discount = 0;
		if (coupon) {
			if (coupon.discountType === 'percentage') {
				discount = (subtotal * coupon.discountValue) / 100;
			} else {
				discount = coupon.discountValue;
			}
		}

		const total = subtotal + deliveryFee - discount;
		const itemsCount = items.reduce((sum, item) => sum + item.quantity, 0);
		const remainingForFreeDelivery = Math.max(0, CART_CONFIG.FREE_DELIVERY_THRESHOLD - subtotal);

		return {
			subtotal,
			deliveryFee,
			discount,
			total,
			itemsCount,
			remainingForFreeDelivery,
		};
	}, [items, coupon]);
}


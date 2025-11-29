// Price calculation utilities

import { CartItem, CartTotals, Coupon } from '../types/cart.types';
import { CART_CONSTANTS } from '../constants/cart.constants';

/**
 * Calculate subtotal from cart items
 */
export const calculateSubtotal = (items: CartItem[]): number => {
	return items.reduce((sum, item) => {
		return sum + item.priceAtAdd * item.quantity;
	}, 0);
};

/**
 * Calculate delivery fee based on items and subtotal
 */
export const calculateDeliveryFee = (items: CartItem[], subtotal: number): number => {
	if (items.length === 0) return 0;
	if (subtotal >= CART_CONSTANTS.FREE_DELIVERY_THRESHOLD) return 0;
	return CART_CONSTANTS.DELIVERY_FEE;
};

/**
 * Calculate discount from coupon
 */
export const calculateDiscount = (subtotal: number, coupon: Coupon | null): number => {
	if (!coupon) return 0;

	if (coupon.discountType === 'percentage') {
		return (subtotal * coupon.discountValue) / 100;
	}

	if (coupon.discountType === 'fixed') {
		return Math.min(coupon.discountValue, subtotal);
	}

	return 0;
};

/**
 * Calculate all cart totals
 */
export const calculateCartTotals = (
	items: CartItem[],
	coupon: Coupon | null
): CartTotals => {
	const subtotal = calculateSubtotal(items);
	const deliveryFee = calculateDeliveryFee(items, subtotal);
	const discount = calculateDiscount(subtotal, coupon);
	const total = subtotal + deliveryFee - discount;

	return {
		subtotal: Math.max(0, subtotal),
		deliveryFee: Math.max(0, deliveryFee),
		discount: Math.max(0, discount),
		total: Math.max(0, total),
		itemsCount: items.reduce((sum, item) => sum + item.quantity, 0),
	};
};

/**
 * Calculate free delivery progress percentage
 */
export const calculateFreeDeliveryProgress = (subtotal: number): number => {
	return Math.min(
		100,
		(subtotal / CART_CONSTANTS.FREE_DELIVERY_THRESHOLD) * 100
	);
};

/**
 * Calculate remaining amount for free delivery
 */
export const calculateRemainingForFreeDelivery = (subtotal: number): number => {
	return Math.max(
		0,
		CART_CONSTANTS.FREE_DELIVERY_THRESHOLD - subtotal
	);
};


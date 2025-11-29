// Validation utilities

import { CartItem } from '../types/cart.types';
import { PaymentMethod, CardDetails } from '../types/payment.types';

/**
 * Validate if cart has items
 */
export const hasCartItems = (items: CartItem[]): boolean => {
	return items.length > 0;
};

/**
 * Validate if address is selected
 */
export const isAddressSelected = (addressId: string | null): boolean => {
	return addressId !== null && addressId !== '';
};

/**
 * Validate if payment method is selected
 */
export const isPaymentMethodSelected = (method: PaymentMethod | null): boolean => {
	return method !== null;
};

/**
 * Validate card details
 */
export const validateCardDetails = (details: CardDetails): {
	isValid: boolean;
	errors: Record<string, string>;
} => {
	const errors: Record<string, string> = {};

	// Card number validation
	const cleanNumber = details.number.replace(/\s/g, '');
	if (!cleanNumber || cleanNumber.length < 15) {
		errors.number = 'Invalid card number';
	}

	// Expiry validation
	const [month, year] = details.expiry.split('/');
	if (!month || !year || parseInt(month) > 12 || parseInt(month) < 1) {
		errors.expiry = 'Invalid expiry date';
	}

	// CVV validation
	if (!details.cvv || details.cvv.length < 3) {
		errors.cvv = 'Invalid CVV';
	}

	// Name validation
	if (!details.name || details.name.trim().length < 3) {
		errors.name = 'Invalid cardholder name';
	}

	return {
		isValid: Object.keys(errors).length === 0,
		errors,
	};
};

/**
 * Validate checkout requirements
 */
export const validateCheckout = (
	items: CartItem[],
	addressId: string | null,
	paymentMethod: PaymentMethod | null,
	cardDetails?: CardDetails
): {
	isValid: boolean;
	errors: string[];
} => {
	const errors: string[] = [];

	if (!hasCartItems(items)) {
		errors.push('Cart is empty');
	}

	if (!isAddressSelected(addressId)) {
		errors.push('Please select a delivery address');
	}

	if (!isPaymentMethodSelected(paymentMethod)) {
		errors.push('Please select a payment method');
	}

	if (paymentMethod === 'card' && cardDetails) {
		const cardValidation = validateCardDetails(cardDetails);
		if (!cardValidation.isValid) {
			errors.push('Invalid card details');
		}
	}

	return {
		isValid: errors.length === 0,
		errors,
	};
};


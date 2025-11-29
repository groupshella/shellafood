// Formatting utilities

/**
 * Format price with currency
 */
export const formatPrice = (
	amount: number,
	currency: string = 'SAR',
	language: 'en' | 'ar' = 'en'
): string => {
	const formatted = amount.toFixed(2);

	if (language === 'ar') {
		return `${formatted} ${currency}`;
	}

	return `${currency} ${formatted}`;
};

/**
 * Format card number with spaces
 */
export const formatCardNumber = (value: string): string => {
	const cleaned = value.replace(/\s/g, '');
	const groups = cleaned.match(/.{1,4}/g) || [];
	return groups.join(' ');
};

/**
 * Format expiry date (MM/YY)
 */
export const formatExpiryDate = (value: string): string => {
	const cleaned = value.replace(/\D/g, '');

	if (cleaned.length >= 2) {
		return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
	}

	return cleaned;
};

/**
 * Format quantity display
 */
export const formatQuantity = (
	quantity: number,
	language: 'en' | 'ar' = 'en'
): string => {
	if (language === 'ar') {
		return `${quantity} ${quantity === 1 ? 'عنصر' : 'عناصر'}`;
	}
	return `${quantity} ${quantity === 1 ? 'item' : 'items'}`;
};


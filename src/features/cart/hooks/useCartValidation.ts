'use client';

import { useMemo } from 'react';
import type { CartItem, PaymentMethod, CardDetails } from '../types/cart.types';

export function useCartValidation(
	items: CartItem[],
	selectedAddressId: string | null,
	selectedPaymentMethod: PaymentMethod | null,
	cardDetails?: CardDetails
) {
	return useMemo(() => {
		const errors: string[] = [];

		if (items.length === 0) {
			errors.push('السلة فارغة');
		}

		if (!selectedAddressId) {
			errors.push('يجب اختيار عنوان التوصيل');
		}

		if (!selectedPaymentMethod) {
			errors.push('يجب اختيار طريقة الدفع');
		}

		if (selectedPaymentMethod === 'card' && cardDetails) {
			if (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvv || !cardDetails.name) {
				errors.push('يجب إكمال بيانات البطاقة');
			}
		}

		return {
			canCheckout: errors.length === 0,
			validationErrors: errors,
		};
	}, [items, selectedAddressId, selectedPaymentMethod, cardDetails]);
}


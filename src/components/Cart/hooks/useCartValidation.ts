// Hook for checkout validation

import { useMemo } from 'react';
import { CartItem, PaymentMethod } from '@/components/Cart/types/cart.types';
import { CardDetails } from '@/components/Cart/types/payment.types';
import { validateCheckout } from '../utils/validation.utils';

/**
 * Hook for checkout validation
 */
export const useCartValidation = (
	items: CartItem[],
	addressId: string | null,
	paymentMethod: PaymentMethod | null,
	cardDetails?: CardDetails
) => {
	const validation = useMemo(() => {
		return validateCheckout(items, addressId, paymentMethod, cardDetails);
	}, [items, addressId, paymentMethod, cardDetails]);

	return {
		canCheckout: validation.isValid,
		validationErrors: validation.errors,
	};
};


// Hook for payment method management

import { useState, useCallback } from 'react';
import { PaymentMethod, CardDetails } from '../types/payment.types';
import { formatCardNumber, formatExpiryDate } from '../utils/formatters.utils';

/**
 * Hook for payment method management
 */
export const usePayment = () => {
	const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
	const [cardDetails, setCardDetails] = useState<CardDetails>({
		number: '',
		expiry: '',
		cvv: '',
		name: '',
	});

	const selectPaymentMethod = useCallback((method: PaymentMethod) => {
		setSelectedPaymentMethod(method);
	}, []);

	const updateCardDetails = useCallback((field: keyof CardDetails, value: string) => {
		setCardDetails(prev => {
			const updated = { ...prev };

			if (field === 'number') {
				updated.number = formatCardNumber(value);
			} else if (field === 'expiry') {
				updated.expiry = formatExpiryDate(value);
			} else if (field === 'cvv') {
				updated.cvv = value.replace(/\D/g, '').slice(0, 3);
			} else {
				updated[field] = value;
			}

			return updated;
		});
	}, []);

	const updateCardDetailsObject = useCallback((details: Partial<CardDetails>) => {
		setCardDetails(prev => ({
			...prev,
			...details,
		}));
	}, []);

	return {
		selectedPaymentMethod,
		cardDetails,
		selectPaymentMethod,
		updateCardDetails,
		updateCardDetailsObject,
	};
};


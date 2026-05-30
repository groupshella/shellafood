'use client';

import { useState, useCallback } from 'react';
import type { PaymentMethod, CardDetails } from '../types/cart.types';

export interface UsePaymentReturn {
	selectedPaymentMethod: PaymentMethod | null;
	cardDetails: CardDetails;
	selectPaymentMethod: (method: PaymentMethod) => void;
	updateCardDetails: (details: Partial<CardDetails>) => void;
	formatCardNumber: (value: string) => string;
	formatExpiryDate: (value: string) => string;
	formatCVV: (value: string) => string;
}

export function usePayment(): UsePaymentReturn {
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

	const updateCardDetails = useCallback((details: Partial<CardDetails>) => {
		setCardDetails(prev => ({ ...prev, ...details }));
	}, []);

	const formatCardNumber = useCallback((value: string): string => {
		const cleaned = value.replace(/\D/g, '').slice(0, 16);
		return cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
	}, []);

	const formatExpiryDate = useCallback((value: string): string => {
		const cleaned = value.replace(/\D/g, '').slice(0, 4);
		return cleaned.length >= 2 ? `${cleaned.slice(0, 2)}/${cleaned.slice(2)}` : cleaned;
	}, []);

	const formatCVV = useCallback((value: string): string => {
		return value.replace(/\D/g, '').slice(0, 3);
	}, []);

	return {
		selectedPaymentMethod,
		cardDetails,
		selectPaymentMethod,
		updateCardDetails,
		formatCardNumber,
		formatExpiryDate,
		formatCVV,
	};
}

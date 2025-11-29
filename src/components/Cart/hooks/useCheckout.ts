// Hook for checkout flow

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { CartTotals } from '@/components/Cart/types/cart.types';
import { PaymentMethod } from '@/components/Cart/types/payment.types';
import { checkoutService } from '../services/checkout.service';

interface CheckoutData {
	addressId: string;
	paymentMethod: PaymentMethod;
	totals: CartTotals;
	couponCode?: string;
}

/**
 * Hook for checkout flow
 */
export const useCheckout = () => {
	const router = useRouter();
	const [isProcessing, setIsProcessing] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const processCheckout = useCallback(async (data: CheckoutData): Promise<void> => {
		setIsProcessing(true);
		setError(null);

		try {
			// Simulate processing steps
			await new Promise(resolve => setTimeout(resolve, 2500));

			// Call checkout service
			await checkoutService.createOrder(data);

			// Redirect to confirmation
			router.push('/checkout/confirmation?type=products');
		} catch (err) {
			console.error('Checkout failed:', err);
			setError(err instanceof Error ? err.message : 'Checkout failed');
			throw err;
		} finally {
			setIsProcessing(false);
		}
	}, [router]);

	const resetError = useCallback(() => {
		setError(null);
	}, []);

	return {
		processCheckout,
		isProcessing,
		error,
		resetError,
	};
};


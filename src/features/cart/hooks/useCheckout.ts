'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/providers';
import { useToast } from '@/shared/components/ui';
import { BASE_URL, DEFAULT_LANG, STORAGE_KEYS } from '@/features/auth/constants/auth.constants';
import { getCookie } from '@/features/auth/lib/utils/cookie.utils';
import type { CartItem, PaymentMethod, CardDetails, CartTotals } from '../types/cart.types';
import type { Address } from '@/shared/hooks/useAddresses';

interface CheckoutPayload {
	cart: [{ item_id: number, quantity: number, variations: any[] ,add_ons: any[],add_ons_ids: any[]}];
	coupon_code: string;
	order_amount: number;
	payment_method: string;
	delivery_address_id: number;
	order_note: string;
	delivery_instruction: string;
	order_type: string;
	store_id: number;
	distance: number;
	address: string;
	longitude: number;
	latitude: number;
}

export function useCheckout(token?: string) {
	const router = useRouter();
	const { language } = useLanguage();
	const isArabic = language === 'ar';
	const { showToast } = useToast();
	const [isProcessing, setIsProcessing] = useState(false);

	const processCheckout = useCallback(async (
		items: CartItem[],
		address: Address,
		paymentMethod: PaymentMethod,
		orderSummary?: CartTotals,
		cardDetails?: CardDetails,
		couponCode?: string
	): Promise<{ success: boolean; orderId?: string; error?: string }> => {
		setIsProcessing(true);
		try {
			// Get auth token
			const authToken = token ;
			if (!authToken) {
				console.log("authToken", authToken);
				return { success: false, error: 'Authentication required' };
			}

			// Validate required data
			if (!address) {
				console.log("address", address);
				return { success: false, error: 'Please select a delivery address' };
			}

			if (items.length === 0) {
				console.log("items", items);
				return { success: false, error: 'Cart is empty' };
			}

			// Get store_id from first item (assuming all items are from same store)
			const storeId = parseInt(items[0].storeId) || 0;
			if (!storeId) {
				console.log("storeId", storeId);
					return { success: false, error: 'Invalid store information' };
			}

			// Format cart items - API expects array of cart item objects with id, item_id, quantity, price
			const cartItems = items.map(item => ({
				item_id: parseInt(item.productId) || 0,
				quantity: item.quantity || 1,
				variations: [],
				add_ons: [],
				add_ons_ids: [],
			}));
			console.log("cartItems", cartItems);
			// Get zone_id and module_id from address
			const zoneId = address.zone_id || address.zone_ids?.[0] || 0;
			// For moduleId, we'll need to get it from store or zone data
			// For now, using 0 as fallback - you may need to fetch it from store details
			const moduleId = 0; // TODO: Get moduleId from store or zone data
			console.log("zoneId", zoneId);
			console.log("moduleId", moduleId);
			// Calculate order amount from orderSummary or items
			const orderAmount = orderSummary?.total || 0;
			console.log("orderAmount", orderAmount);
			// Map payment method to API format
			const paymentMethodMap: Record<string, string> = {
				'cash': 'cash_on_delivery',
				'wallet': 'wallet',
				'kaidha': 'wallet_qidha',
				'myfatoorah': 'digital_payment',
				'offline': 'offline_payment',
			};
			const apiPaymentMethod = paymentMethodMap[paymentMethod || 'cash'] || 'cash_on_delivery';
			console.log("apiPaymentMethod", apiPaymentMethod);
			// Prepare request body
			const payload: CheckoutPayload = {
				cart: cartItems as any,
				coupon_code: couponCode || '',
				order_amount: orderAmount,
				payment_method: apiPaymentMethod,
				delivery_address_id: address.id,
				order_note: '',
				delivery_instruction: '',
				order_type: 'delivery',
				store_id: storeId,
				distance: 2.5,
				address: address.address || '',
				longitude: parseFloat(address.longitude || '0'),
				latitude: parseFloat(address.latitude || '0'),
			};
			console.log("payload", payload);
			// Make API call
			const response = await fetch(`${BASE_URL}/api/v1/customer/order/place`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json',
					'X-localization': language || DEFAULT_LANG,
					'moduleId': "6",
					'zoneId': "[2]",
					'Authorization': `Bearer ${authToken}`,
				},
				body: JSON.stringify(payload),
			});

		
console.log("response", response);
			const result = await response.json();
			console.log("result", result);
			
			// Check if request was successful
			if (!response.ok) {
				const errorMessage = result.message || result.error || (isArabic ? 'فشل إتمام الطلب' : 'Failed to place order');
				showToast(
					errorMessage,
					'error',
					isArabic ? errorMessage : undefined
				);
				return { success: false, error: errorMessage };
			}
			
			// Success - show notification and route to my-orders
			const successMessage = result.message || (isArabic ? 'تم وضع الطلب بنجاح' : 'Order placed successfully');
			const orderId = result.order_id || result.id || result.data?.order_id;
			console.log("orderId", orderId);
		
			
			// Route to my-orders page
			setTimeout(() => {
				router.push(`/my-orders/${orderId}/track`);
			}, 1000); // Small delay to show the notification
			
			return { success: true, orderId: orderId?.toString() };
		} catch (error: any) {
			console.log('Checkout error:', error);
			return { success: false, error: error.message || 'فشل إتمام الطلب' };
		} finally {
			setIsProcessing(false);
		}
	}, [router, language, token, isArabic, showToast]);

	return {
		processCheckout,
		isProcessing,
	};
}


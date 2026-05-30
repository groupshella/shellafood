'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/providers';
import { useToast } from '@/shared/components/ui';
import { BASE_URL, DEFAULT_LANG, STORAGE_KEYS, getBaseUrl } from '@/features/auth/constants/auth.constants';
import { getCookie } from '@/features/auth/lib/utils/cookie.utils';
import type { CartItem, PaymentMethod, CardDetails, CartTotals } from '../types/cart.types';
import type { Address } from '@/shared/hooks/useAddresses';

interface CheckoutPayload {
	cart: Array<{
		item_id: number;
		quantity: number;
		variation: any[];
		add_on_ids: any[];
		add_on_qtys: any[];
	}>;
	coupon_code: string;
	order_amount: number;
	payment_method: string;
	order_type: string;
	store_id: number;
	distance: number;
	address: string;
	longitude: number;
	latitude: number;
	order_note?: string;
	delivery_instruction?: string;
	delivery_address_id?: number;
}

export function useCheckout(token?: string) {
	const router = useRouter();
	const { language } = useLanguage();
	const isArabic = language === 'ar';
	const { showToast } = useToast();

	const [isProcessing, setIsProcessing] = useState(false);
	const toRadians = (degrees: number): number => {
		return degrees * (Math.PI / 180);
	  }
	const calculateDistance = (
		lat1: number,
		lon1: number,
		lat2: number,
		lon2: number
	  ): number => {
		const R = 6371; // Earth's radius in kilometers
		
		const dLat = toRadians(lat2 - lat1);
		const dLon = toRadians(lon2 - lon1);
		
		const a =
		  Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		  Math.cos(toRadians(lat1)) *
		  Math.cos(toRadians(lat2)) *
		  Math.sin(dLon / 2) *
		  Math.sin(dLon / 2);
		
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		
		const distance = R * c;
		
		return distance;
	  }
	const processCheckout = useCallback(async (
		items: CartItem[],
		address: Address,
		paymentMethod: PaymentMethod,
		orderSummary?: CartTotals,
		cardDetails?: CardDetails,
		couponCode?: string
	): Promise<{ success: boolean; orderId?: string; error?: string }> => {
		const latitudeStore = sessionStorage.getItem('latitude_store');
		const longitudeStore = sessionStorage.getItem('longitude_store');
		const moduleId = sessionStorage.getItem('module_id_store');
		const zoneId = sessionStorage.getItem('zone_id_store');
		
		setIsProcessing(true);
		const distance = calculateDistance(parseFloat(address.latitude || '0'), parseFloat(address.longitude || '0'), parseFloat(latitudeStore || '0') || 0, parseFloat(longitudeStore || '0') || 0);
		console.log("distance", distance);
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

			// Format cart items - API expects array of cart item objects
			const cartItems = items.map(item => ({
				item_id: parseInt(item.productId) || 0,
				quantity: item.quantity || 1,
				variation: [],
				add_on_ids: [],
				add_on_qtys: [],
			}));
			console.log("cartItems", cartItems);
			// Get zone_id and module_id from address
			// For moduleId, we'll need to get it from store or zone data
			// For now, using 0 as fallback - you may need to fetch it from store details
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
				cart: cartItems,
				coupon_code: couponCode || '',
				order_amount: orderAmount,
				payment_method: apiPaymentMethod,
				order_type: 'delivery',
				store_id: storeId,
				distance: distance,
				address: address.address || '',
				longitude: parseFloat(address.longitude || '0'),
				latitude: parseFloat(address.latitude || '0'),
				order_note: '',
				delivery_instruction: '',
				...(address.id && { delivery_address_id: address.id }),
			};
			console.log("payload", payload);
			console.log("moduleId", moduleId);
			console.log("zoneId", zoneId);
			// ✅ Use API route as proxy
			const baseUrl = getBaseUrl();
			const response = await fetch(`${baseUrl}/api/order/place`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json',
					'X-localization': language || DEFAULT_LANG,
					'moduleId': moduleId?.toString() || '',
					'zoneId':`[${zoneId?.toString()}]`
				},
				body: JSON.stringify(payload),
			});

			// Check if request was successful
			if (!response.ok) {
				let errorMessage = isArabic ? 'فشل إتمام الطلب' : 'Failed to place order';
				try {
					const errorData = await response.json();
					errorMessage = errorData.error || errorData.message || errorMessage;
				} catch {
					// If JSON parsing fails, use default message
				}
				console.log("errorMessage", errorMessage);
				showToast(
					errorMessage,
					'error',
					isArabic ? errorMessage : undefined
				);
				return { success: false, error: errorMessage };
			}
			
			const result = await response.json();
			console.log("result in useCheckout", result);
			
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


'use client';

import { useState, useCallback } from 'react';
import { useLanguage } from '@/providers';
import { getBaseUrl } from '@/features/(actors)/auth/constants/auth.constants';
import type {
	CheckoutState,
	UseCheckoutReturn,
	DeliveryAddress,
	PaymentMethod,
	OrderType,
	DeliveryInfo,
} from '../types/checkout.types';
import { getCookieClient } from '../utils/checkout.utils';

// ─── Initial State ────────────────────────────────────────────────────────────

const INITIAL_STATE: CheckoutState = {
	step: 'address',
	orderType: 'delivery',
	address: null,
	paymentMethod: 'cash_on_delivery',
	orderNote: '',
	dmTips: 0,
	couponCode: '',
	deliveryInfo: null,
	placedOrderId: null,
	orderAmount: 0,
	isLoading: false,
	error: null,
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useCheckout(
	storeId: number,
	orderAmount: number,
	distance: number
): UseCheckoutReturn {
	const { language } = useLanguage();
	const baseUrl = getBaseUrl();
	const [state, setState] = useState<CheckoutState>({
		...INITIAL_STATE,
		orderAmount,
	});

	const update = useCallback((patch: Partial<CheckoutState>) => {
		setState((prev) => ({ ...prev, ...patch }));
	}, []);

	// ─── Setters ──────────────────────────────────────────────────────────────

	const setAddress = useCallback(
		(address: DeliveryAddress) => update({ address, error: null }),
		[update]
	);

	const setPaymentMethod = useCallback(
		(paymentMethod: PaymentMethod) => update({ paymentMethod }),
		[update]
	);

	const setOrderNote = useCallback(
		(orderNote: string) => update({ orderNote }),
		[update]
	);

	const setDmTips = useCallback(
		(dmTips: number) => update({ dmTips }),
		[update]
	);

	const setCouponCode = useCallback(
		(couponCode: string) => update({ couponCode }),
		[update]
	);

	const setOrderType = useCallback(
		(orderType: OrderType) => update({ orderType }),
		[update]
	);

	// ─── Fetch delivery fee ───────────────────────────────────────────────────

	const fetchDeliveryFee = useCallback(async (): Promise<DeliveryInfo | null> => {
		if (state.orderType === 'take_away') return null;
		if (!state.address) return null;

		try {
			const res = await fetch(`${baseUrl}/api/checkout/delivery-fee`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'x-localization': language,
				},
				body: JSON.stringify({
					order_amount: orderAmount,
					order_type: state.orderType,
					store_id: storeId,
					distance,
					address: state.address.address,
					latitude: state.address.latitude,
					longitude: state.address.longitude,
					contact_person_name: state.address.contact_person_name,
					contact_person_number: state.address.contact_person_number,
				}),
			});

			if (!res.ok) return null;
			return res.json();
		} catch {
			return null;
		}
	}, [baseUrl, language, orderAmount, storeId, distance, state.orderType, state.address]);

	// ─── Step navigation ──────────────────────────────────────────────────────

	const goToPayment = useCallback(async () => {
		if (state.orderType === 'delivery' && !state.address) {
			update({ error: 'يرجى تحديد عنوان التوصيل' });
			return;
		}

		update({ isLoading: true, error: null });
		const deliveryInfo = await fetchDeliveryFee();
		update({ step: 'payment', deliveryInfo, isLoading: false });
	}, [state.orderType, state.address, fetchDeliveryFee, update]);

	const goToConfirm = useCallback(() => {
		if (!state.paymentMethod) {
			update({ error: 'يرجى اختيار طريقة الدفع' });
			return;
		}
		update({ step: 'confirm', error: null });
	}, [state.paymentMethod, update]);

	const goBack = useCallback(() => {
		setState((prev) => ({
			...prev,
			error: null,
			step:
				prev.step === 'confirm'
					? 'payment'
					: prev.step === 'payment'
						? 'address'
						: prev.step,
		}));
	}, []);

	// ─── Place Order ──────────────────────────────────────────────────────────

	const placeOrder = useCallback(async () => {
		update({ isLoading: true, error: null });

		try {
			const guestId = getCookieClient('guest_id');

			const payload: Record<string, unknown> = {
				order_amount: orderAmount,
				order_type: state.orderType,
				store_id: storeId,
				order_note: state.orderNote || undefined,
				coupon_code: state.couponCode || undefined,
				dm_tips: state.dmTips || 0,
			};

			if (state.orderType === 'delivery' && state.address) {
				payload.distance = distance;
				payload.address = state.address.address;
				payload.latitude = state.address.latitude;
				payload.longitude = state.address.longitude;
				payload.contact_person_name = state.address.contact_person_name;
				payload.contact_person_number = state.address.contact_person_number;
			}

			if (guestId) {
				payload.guest_id = guestId;
			}

			const res = await fetch(`${baseUrl}/api/checkout/place-order`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'x-localization': language,
				},
				body: JSON.stringify(payload),
			});

			const data = await res.json();

			if (!res.ok) {
				throw new Error(data.error || 'فشل في إنشاء الطلب');
			}

			update({ placedOrderId: data.order_id });
		} catch (error: any) {
			update({ error: error.message || 'فشل في إنشاء الطلب', isLoading: false });
			throw error;
		}
	}, [baseUrl, language, orderAmount, storeId, distance, state, update]);

	// ─── Process Payment ──────────────────────────────────────────────────────

	const processPayment = useCallback(async () => {
		if (!state.placedOrderId) {
			update({ error: 'لم يتم إنشاء الطلب بعد' });
			return;
		}

		try {
			const res = await fetch(`${baseUrl}/api/checkout/process-payment`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'x-localization': language,
				},
				body: JSON.stringify({
					order_id: state.placedOrderId,
					payment_method: state.paymentMethod,
					amount: orderAmount,
				}),
			});

			const data = await res.json();

			if (!res.ok) {
				throw new Error(data.error || 'فشل في معالجة الدفع');
			}

			update({ step: 'success', isLoading: false });
		} catch (error: any) {
			update({ error: error.message || 'فشل في معالجة الدفع', isLoading: false });
			throw error;
		}
	}, [baseUrl, language, orderAmount, state.placedOrderId, state.paymentMethod, update]);

	return {
		state,
		goToPayment,
		goToConfirm,
		goBack,
		setAddress,
		setPaymentMethod,
		setOrderNote,
		setDmTips,
		setCouponCode,
		setOrderType,
		placeOrder,
		processPayment,
	};
}
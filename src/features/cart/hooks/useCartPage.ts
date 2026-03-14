'use client';

import { useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/providers';
import { useToast } from '@/shared/components/ui';
import { useCartItems } from './useCartItems';
import { useCartCalculations } from './useCartCalculations';
import { useCartValidation } from './useCartValidation';
import { useCheckout } from './useCheckout';
import { useCoupon } from './useCoupon';
import { usePayment } from './usePayment';
import { groupItemsByStore } from '../lib/utils/cart.utils';
import { CART_CONFIG } from '../constants/cart.constants';
import type { CardDetails, CartItem, CartTotals, GroupedItems, PaymentMethod } from '../types/cart.types';
import type { Address } from '@/shared/hooks/useAddresses';

export interface UseCartPageReturn {
	// Language
	language: 'en' | 'ar';
	isArabic: boolean;

	// Toast
	toasts: any[];
	showToast: (message: string, type: 'success' | 'error' | 'warning' | 'info', messageAr?: string) => void;
	removeToast: (id: string) => void;

	// Modal states
	showCheckoutModal: boolean;
	showClearAllModal: boolean;
	setShowCheckoutModal: (show: boolean) => void;
	setShowClearAllModal: (show: boolean) => void;

	// Cart items
	items: CartItem[];
	isLoading: boolean;
	isUpdating: boolean;
	productsByStore: GroupedItems;
	updateQuantity: (cartId: string, priceAtAdd: number, quantity: number) => Promise<boolean>;
	removeItem: (cartId: string) => Promise<boolean>;
		clearAll: () => Promise<boolean>;

	// Coupon
	appliedCoupon: any;
	isApplyingCoupon: boolean;
	couponError: string | null;
	applyCoupon: (code: string) => Promise<boolean>;
	removeCoupon: () => void;


	selectedAddress: Address | null;
	setSelectedAddress: (address: Address | null) => void;
	

	// Payment
	selectedPaymentMethod: any;
	cardDetails: any;
	selectPaymentMethod: (method: any) => void;
	updateCardDetails: (details: Partial<any>) => void;
	formatCardNumber: (value: string) => string;
	formatExpiryDate: (value: string) => string;
	formatCVV: (value: string) => string;

	// Calculations
	calculations: any;
	orderSummary: CartTotals;
	remainingForFreeDelivery: number;
	showPromoBanner: boolean;

	// Validation
	canCheckout: boolean;
	validationErrors: string[];

	// Checkout
	isProcessing: boolean;
		processCheckout: (items: CartItem[], address: Address, paymentMethod: PaymentMethod	, orderSummary?: CartTotals, cardDetails?: CardDetails, couponCode?: string) => Promise<any>;

	// Handlers
	handleCheckoutClick: () => void;
	handleCheckoutConfirm: () => Promise<void>;
	handleClearAll: () => Promise<void>;
	handleContinueShopping: () => void;
}

export function useCartPage(initialCartData?: any[], token?: string	): UseCartPageReturn {
	const router = useRouter();
	const { language } = useLanguage();
	const isArabic = language === 'ar';
	const { toasts, showToast, removeToast } = useToast();
	const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
	// Modal states
	const [showCheckoutModal, setShowCheckoutModal] = useState(false);
	const [showClearAllModal, setShowClearAllModal] = useState(false);

	// Cart items management
	const { items, isLoading, isUpdating, updateQuantity, removeItem, clearAll } = useCartItems(initialCartData);
console.log("items", items);
	// Coupon management
	const { appliedCoupon, isApplying: isApplyingCoupon, error: couponError, applyCoupon, removeCoupon } = useCoupon();

	// Address management
	
	// Payment management
	const { 
		selectedPaymentMethod, 
		cardDetails, 
		selectPaymentMethod,
		updateCardDetails,
		formatCardNumber,
		formatExpiryDate,
		formatCVV,
	} = usePayment();

	// Calculations
	const calculations = useCartCalculations(items, appliedCoupon);

	// Validation
	const { canCheckout, validationErrors } = useCartValidation(
		items,
		selectedAddress?.id as number,
		selectedPaymentMethod,
		cardDetails
	);

	// Checkout
	console.log("token in useCartPage", token)
	const { processCheckout, isProcessing } = useCheckout(token);

	// Computed values
	const productsByStore = useMemo(() => groupItemsByStore(items), [items]);
	const orderSummary = useMemo(
		() => ({
			subtotal: calculations.subtotal,
			deliveryFee: calculations.deliveryFee,
			discount: calculations.discount,
			total: calculations.total,
			itemsCount: calculations.itemsCount,
		}),
		[calculations]
	);

	const remainingForFreeDelivery = calculations.remainingForFreeDelivery || 0;
	const showPromoBanner = items.length > 0 && calculations.subtotal < CART_CONFIG.FREE_DELIVERY_THRESHOLD;

	// Handlers
	const handleCheckoutClick = useCallback(() => {
		if(!token) {
			router.push('/login');
			return;
		}
		if (!canCheckout) {
			validationErrors.forEach((error) => {
				showToast(isArabic ? error : error, 'warning', isArabic ? error : undefined);
			});
			return;
		}
		setShowCheckoutModal(true);
	}, [canCheckout, validationErrors, isArabic, showToast, router, token]);

	const handleCheckoutConfirm = useCallback(async () => {
		if (!selectedAddress) {
			showToast(
				isArabic ? 'يجب اختيار عنوان التوصيل' : 'Please select a delivery address',
				'warning',
				isArabic ? 'يجب اختيار عنوان التوصيل' : undefined
			);
			return;
		}
		if (!selectedPaymentMethod) {
			showToast(
				isArabic ? 'يجب اختيار طريقة الدفع' : 'Please select a payment method',
				'warning',
				isArabic ? 'يجب اختيار طريقة الدفع' : undefined
			);
			return;
		}
		try {
			const result = await processCheckout(
				items,
				selectedAddress,
				selectedPaymentMethod,
				orderSummary,
				cardDetails,
				appliedCoupon?.code,
			);
			if (result.success) {
				setShowCheckoutModal(false);
				showToast(
					isArabic ? 'تم وضع الطلب بنجاح' : 'Order placed successfully',
					'success',
					isArabic ? 'تم وضع الطلب بنجاح' : undefined
				);
			} else {
				setShowCheckoutModal(false);
				showToast(
					result.error || (isArabic ? 'فشل إتمام الطلب' : 'Failed to place order'),
					'error',
					result.error
				);
			}
		} catch (error: any) {
			setShowCheckoutModal(false);
			showToast(
				error?.message || (isArabic ? 'فشل إتمام الطلب' : 'Failed to place order'),
				'error',
				isArabic ? error?.message : undefined
			);
		}
	}, [items, selectedAddress, selectedPaymentMethod, cardDetails, appliedCoupon, processCheckout, orderSummary, isArabic, showToast]);

	const handleClearAll = useCallback(async () => {
		try {
			await clearAll();
			setShowClearAllModal(false);
			removeCoupon();
			showToast(
				isArabic ? 'تم مسح جميع المنتجات من السلة' : 'All products cleared from cart',
				'success',
				isArabic ? 'تم مسح جميع المنتجات من السلة' : undefined
			);
		} catch (error) {
			showToast(
				isArabic ? 'حدث خطأ في مسح السلة' : 'Error clearing cart',
				'error',
				isArabic ? 'حدث خطأ في مسح السلة' : undefined
			);
		}
	}, [clearAll, removeCoupon, isArabic, showToast]);

	const handleContinueShopping = useCallback(() => {
		router.push('/categories');
	}, [router]);

	return {
		// Language
		language,
		isArabic,

		// Toast
		toasts,
		showToast,
		removeToast,

		// Modal states
		showCheckoutModal,
		showClearAllModal,
		setShowCheckoutModal,
		setShowClearAllModal,

		// Cart items
		items,
		isLoading,
		isUpdating,
		productsByStore,
		updateQuantity,
		removeItem,
		clearAll,

		// Coupon
		appliedCoupon,
		isApplyingCoupon,
		couponError,
		applyCoupon,
		removeCoupon,

		selectedAddress,
			setSelectedAddress,
		// Payment
		selectedPaymentMethod,
		cardDetails,
		selectPaymentMethod,
		updateCardDetails,
		formatCardNumber,
		formatExpiryDate,
		formatCVV,

		// Calculations
		calculations,
		orderSummary,
		remainingForFreeDelivery,
		showPromoBanner,

		// Validation
		canCheckout,
		validationErrors,

		// Checkout
		isProcessing,
		processCheckout,

		// Handlers
		handleCheckoutClick,
		handleCheckoutConfirm,
		handleClearAll,
		handleContinueShopping,
	};
}


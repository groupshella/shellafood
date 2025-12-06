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
import { useAddress } from './useAddress';
import { usePayment } from './usePayment';
import { groupItemsByStore } from '../lib/utils/cart.utils';
import { CART_CONFIG } from '../constants/cart.constants';
import type { CartItem, CartTotals, GroupedItems } from '../types/cart.types';

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
	updateQuantity: (itemId: string, quantity: number) => Promise<void>;
	removeItem: (itemId: string) => Promise<void>;
	clearAll: () => Promise<void>;

	// Coupon
	appliedCoupon: any;
	isApplyingCoupon: boolean;
	couponError: string | null;
	applyCoupon: (code: string) => Promise<boolean>;
	removeCoupon: () => void;

	// Address
	addresses: any[];
	selectedAddressId: string | null;
	isAddressLoading: boolean;
	selectAddress: (addressId: string) => void;
	saveNewAddress: (addressData: any) => Promise<boolean>;
	deleteAddressById: (addressId: string) => Promise<boolean>;

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
	processCheckout: (items: CartItem[], addressId: string, paymentMethod: any, cardDetails: any, couponCode?: string) => Promise<any>;

	// Handlers
	handleCheckoutClick: () => void;
	handleCheckoutConfirm: () => Promise<void>;
	handleClearAll: () => Promise<void>;
	handleContinueShopping: () => void;
}

export function useCartPage(): UseCartPageReturn {
	const router = useRouter();
	const { language } = useLanguage();
	const isArabic = language === 'ar';
	const { toasts, showToast, removeToast } = useToast();

	// Modal states
	const [showCheckoutModal, setShowCheckoutModal] = useState(false);
	const [showClearAllModal, setShowClearAllModal] = useState(false);

	// Cart items management
	const { items, isLoading, isUpdating, updateQuantity, removeItem, clearAll } = useCartItems();

	// Coupon management
	const { appliedCoupon, isApplying: isApplyingCoupon, error: couponError, applyCoupon, removeCoupon } = useCoupon();

	// Address management
	const { addresses, selectedAddressId, isLoading: isAddressLoading, selectAddress, saveNewAddress, deleteAddressById } = useAddress(language);

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
		selectedAddressId,
		selectedPaymentMethod,
		cardDetails
	);

	// Checkout
	const { processCheckout, isProcessing } = useCheckout();

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
		if (!canCheckout) {
			validationErrors.forEach((error) => {
				showToast(isArabic ? error : error, 'warning', isArabic ? error : undefined);
			});
			return;
		}
		setShowCheckoutModal(true);
	}, [canCheckout, validationErrors, isArabic, showToast]);

	const handleCheckoutConfirm = useCallback(async () => {
		try {
			const result = await processCheckout(
				items,
				selectedAddressId!,
				selectedPaymentMethod!,
				cardDetails,
				appliedCoupon?.code
			);
			if (!result.success) {
				setShowCheckoutModal(false);
			}
		} catch (error) {
			setShowCheckoutModal(false);
		}
	}, [items, selectedAddressId, selectedPaymentMethod, cardDetails, appliedCoupon, processCheckout]);

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

		// Address
		addresses,
		selectedAddressId,
		isAddressLoading,
		selectAddress,
		saveNewAddress,
		deleteAddressById,

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


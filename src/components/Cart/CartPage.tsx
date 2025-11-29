"use client";

import React, { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRouter } from "next/navigation";
import { ShoppingCart, ArrowLeft, Sparkles, Trash2, AlertTriangle, Store as StoreIcon } from "lucide-react";
import { ToastContainer, useToast } from "@/components/ui/Toast";

// Import existing components (will be refactored later)
import CartItemCard from "./CartItemCard";
import CouponSection from "./CouponSection";
import AddressSelector from "./AddressSelector";
import PaymentOptions from "./PaymentOptions";
import OrderSummary from "./OrderSummary";
import EmptyCartState from "./ui/EmptyCartState";
import { CartItemSkeleton } from "./ui/skeletons/CartItemSkeleton";
import { OrderSummarySkeleton } from "./ui/skeletons/SummarySkeleton";
import ConfirmCheckoutModal from "./modals/ConfirmCheckoutModal";

// Import new hooks and utilities
import { useCartItems } from "./hooks/useCartItems";
import { useCartCalculations } from "./hooks/useCartCalculations";
import { useCartValidation } from "./hooks/useCartValidation";
import { useCheckout } from "./hooks/useCheckout";
import { useCoupon } from "./hooks/useCoupon";
import { useAddress } from "./hooks/useAddress";
import { usePayment } from "./hooks/usePayment";
import { groupItemsByStore } from "./utils/grouping.utils";
import { calculateRemainingForFreeDelivery } from "./utils/pricing.utils";
import { CART_CONSTANTS } from "./constants/cart.constants";
import { CartItem, Coupon } from "./types/cart.types";

export default function CartPage() {
	const { language } = useLanguage();
	const router = useRouter();
	const isArabic = language === "ar";
	const { toasts, showToast, removeToast } = useToast();

	// Cart items management
	const {
		items,
		isLoading,
		isUpdating,
		updateQuantity,
		removeItem,
		clearAll,
	} = useCartItems();

	// Coupon management
	const {
		appliedCoupon,
		isValidating: isCouponValidating,
		error: couponError,
		validateCoupon,
		removeCoupon,
	} = useCoupon();

	// Address management
	const {
		selectedAddressId,
		addresses,
		selectAddress,
		isLoading: isAddressLoading,
	} = useAddress(language);

	// Payment management
	const {
		selectedPaymentMethod,
		cardDetails,
		selectPaymentMethod,
		updateCardDetails,
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
	const { processCheckout, isProcessing, error: checkoutError } = useCheckout();

	// Local state
	const [showCheckoutModal, setShowCheckoutModal] = useState(false);
	const [showClearAllModal, setShowClearAllModal] = useState(false);

	// Group items by store
	const productsByStore = useMemo(() => {
		return groupItemsByStore(items);
	}, [items]);

	// Handle coupon applied (bridge to existing CouponSection)
	const handleCouponApplied = useCallback((coupon: Coupon) => {
		// The useCoupon hook manages state, but CouponSection expects a callback
		// This is a temporary bridge until CouponSection is refactored
		validateCoupon(coupon.code);
	}, [validateCoupon]);

	// Handle checkout click
	const handleCheckoutClick = useCallback(() => {
		if (!canCheckout) {
			validationErrors.forEach(error => {
				showToast(
					isArabic ? error : error,
					"warning",
					isArabic ? error : undefined
				);
			});
			return;
		}
		setShowCheckoutModal(true);
	}, [canCheckout, validationErrors, isArabic, showToast]);

	// Handle checkout confirmation
	const handleCheckoutConfirm = useCallback(async () => {
		try {
			await processCheckout({
				addressId: selectedAddressId!,
				paymentMethod: selectedPaymentMethod!,
				totals: calculations,
				couponCode: appliedCoupon?.code,
			});
		} catch (error) {
			setShowCheckoutModal(false);
		}
	}, [processCheckout, selectedAddressId, selectedPaymentMethod, calculations, appliedCoupon]);

	// Handle clear all
	const handleClearAll = useCallback(async () => {
		try {
			await clearAll();
			setShowClearAllModal(false);
			removeCoupon(); // Clear coupon when clearing cart
			showToast(
				isArabic ? "تم مسح جميع المنتجات من السلة" : "All products cleared from cart",
				"success",
				isArabic ? "تم مسح جميع المنتجات من السلة" : undefined
			);
		} catch (error) {
			showToast(
				isArabic ? "حدث خطأ في مسح السلة" : "Error clearing cart",
				"error",
				isArabic ? "حدث خطأ في مسح السلة" : undefined
			);
		}
	}, [clearAll, removeCoupon, isArabic, showToast]);

	// Order summary object
	const orderSummary = useMemo(() => ({
		subtotal: calculations.subtotal,
		deliveryFee: calculations.deliveryFee,
		discount: calculations.discount,
		total: calculations.total,
		itemsCount: calculations.itemsCount,
	}), [calculations]);

	// Empty state
	if (!isLoading && items.length === 0) {
		return (
			<>
				<EmptyCartState language={language} />
				<ToastContainer toasts={toasts} onRemoveToast={removeToast} isArabic={isArabic} />
			</>
		);
	}

	// Calculate remaining for free delivery
	const remainingForFreeDelivery = calculateRemainingForFreeDelivery(calculations.subtotal);

	return (
		<div
			className={`min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 ${isArabic ? "rtl" : "ltr"}`}
			dir={isArabic ? "rtl" : "ltr"}
		>
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.3 }}
					className={`mb-6 sm:mb-8 ${isArabic ? "text-right" : "text-left"}`}
				>
					<div className="flex items-center justify-between mb-4">
						<div className={`flex items-center gap-3`}>
							<motion.div
								whileHover={{ scale: 1.05, rotate: -5 }}
								whileTap={{ scale: 0.95 }}
								className="relative"
							>
								<ShoppingCart className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-600 dark:text-emerald-400" />
								{items.length > 0 && (
									<motion.div
										initial={{ scale: 0 }}
										animate={{ scale: 1 }}
										className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 dark:bg-emerald-400 rounded-full flex items-center justify-center"
									>
										<span className="text-xs font-bold text-white">{calculations.itemsCount}</span>
									</motion.div>
								)}
							</motion.div>
							<div>
								<h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-gray-100">
									{isArabic ? "سلة التسوق" : "Shopping Cart"}
								</h1>
								<p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
									{isArabic
										? `${calculations.itemsCount} ${calculations.itemsCount === 1 ? "عنصر" : "عناصر"} في السلة`
										: `${calculations.itemsCount} ${calculations.itemsCount === 1 ? "item" : "items"} in cart`}
								</p>
							</div>
						</div>
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							onClick={() => router.push("/categories")}
							className={`flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors ${isArabic ? "flex-row-reverse" : ""}`}
						>
							<ArrowLeft className={`w-5 h-5 ${isArabic ? "rotate-180" : ""}`} />
							<span className="text-sm font-medium">{isArabic ? "متابعة التسوق" : "Continue Shopping"}</span>
						</motion.button>
					</div>

					{/* Promo Banner */}
					{items.length > 0 && calculations.subtotal < CART_CONSTANTS.FREE_DELIVERY_THRESHOLD && (
						<motion.div
							initial={{ opacity: 0, y: -10 }}
							animate={{ opacity: 1, y: 0 }}
							className="flex items-center gap-2 p-3 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl"
						>
							<Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
							<p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
								{isArabic
									? `أضف ${remainingForFreeDelivery.toFixed(2)} ريال أخرى للحصول على توصيل مجاني!`
									: `Add ${remainingForFreeDelivery.toFixed(2)} SAR more for free delivery!`}
							</p>
						</motion.div>
					)}
				</motion.div>

				{isLoading ? (
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
						<div className="lg:col-span-2 space-y-4">
							{[1, 2, 3].map((i) => (
								<CartItemSkeleton key={i} />
							))}
						</div>
						<div className="lg:col-span-1">
							<OrderSummarySkeleton />
						</div>
					</div>
				) : (
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
						{/* Left Column - Items */}
						<div className="lg:col-span-2 space-y-6">
							{/* Clear All Button */}
							{items.length > 0 && (
								<motion.div
									initial={{ opacity: 0, y: -10 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.3 }}
									className="flex justify-end"
								>
									<button
										onClick={() => setShowClearAllModal(true)}
										disabled={isUpdating}
										className={`flex items-center gap-2 px-4 py-2.5 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${isArabic ? "flex-row-reverse" : ""}`}
									>
										<Trash2 className="w-4 h-4" />
										<span className="text-sm">{isArabic ? "مسح الكل" : "Clear All"}</span>
									</button>
								</motion.div>
							)}

							{/* Products Section with Store Grouping */}
							{items.length > 0 && (
								<motion.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.4 }}
									className="space-y-6"
								>
									{Object.entries(productsByStore).map(([storeId, storeData], storeIndex) => (
										<motion.div
											key={storeId}
											initial={{ opacity: 0, y: 20 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ duration: 0.3, delay: storeIndex * 0.1 }}
											className="space-y-4"
										>
											{/* Store Header */}
											<div className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
												{storeData.store.logo ? (
													<div className="relative w-10 h-10 rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-700">
														<img
															src={storeData.store.logo}
															alt={isArabic ? storeData.store.nameAr || storeData.store.name : storeData.store.name}
															className="w-full h-full object-cover"
														/>
													</div>
												) : (
													<div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900/30 dark:to-emerald-800/30 flex items-center justify-center border border-emerald-200 dark:border-emerald-800">
														<StoreIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
													</div>
												)}
												<div className="flex-1">
													<h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
														{isArabic ? storeData.store.nameAr || storeData.store.name : storeData.store.name}
													</h2>
													<p className="text-xs text-gray-500 dark:text-gray-400">
														{storeData.items.length} {isArabic ? "منتج" : "product"}{storeData.items.length !== 1 ? (isArabic ? "ات" : "s") : ""}
													</p>
												</div>
											</div>

											{/* Store Items */}
											<AnimatePresence mode="popLayout">
												{storeData.items.map((item, index) => (
													<motion.div
														key={item.id}
														initial={{ opacity: 0, x: isArabic ? 20 : -20 }}
														animate={{ opacity: 1, x: 0 }}
														exit={{ opacity: 0, x: isArabic ? -20 : 20, scale: 0.95 }}
														transition={{ duration: 0.3, delay: index * 0.05 }}
														layout
													>
														<CartItemCard
															item={item as any}
															language={language}
															onUpdateQuantity={updateQuantity}
															onRemove={removeItem}
														/>
													</motion.div>
												))}
											</AnimatePresence>
										</motion.div>
									))}
								</motion.div>
							)}
						</div>

						{/* Right Column - Summary & Options */}
						<div className="lg:col-span-1 space-y-6">
							{/* Coupon Section */}
							<CouponSection
								language={language}
								onCouponApplied={handleCouponApplied}
								onCouponRemoved={removeCoupon}
								appliedCoupon={appliedCoupon}
							/>

							{/* Address Selector */}
							<AddressSelector
								language={language}
								selectedAddressId={selectedAddressId || undefined}
								onAddressSelect={selectAddress}
							/>

							{/* Payment Options */}
							<PaymentOptions
								language={language}
								selectedMethod={selectedPaymentMethod}
								onMethodSelect={selectPaymentMethod}
							/>

							{/* Order Summary */}
							<OrderSummary
								language={language}
								subtotal={calculations.subtotal}
								deliveryFee={calculations.deliveryFee}
								discount={calculations.discount}
								couponDiscount={0}
								total={calculations.total}
								isLoading={isProcessing}
								onCheckout={handleCheckoutClick}
								canCheckout={canCheckout && !isUpdating && calculations.total > 0}
								estimatedDeliveryTime={items.length > 0 ? "30-45 min" : undefined}
								estimatedDeliveryTimeAr={items.length > 0 ? "30-45 دقيقة" : undefined}
							/>
						</div>
					</div>
				)}
			</div>

			{/* Clear All Confirmation Modal */}
			<AnimatePresence>
				{showClearAllModal && (
					<>
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							onClick={() => setShowClearAllModal(false)}
							className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
						/>
						<div className="fixed inset-0 z-50 flex items-center justify-center p-4" dir={isArabic ? "rtl" : "ltr"}>
							<motion.div
								initial={{ opacity: 0, scale: 0.95, y: 20 }}
								animate={{ opacity: 1, scale: 1, y: 0 }}
								exit={{ opacity: 0, scale: 0.95, y: 20 }}
								transition={{ duration: 0.2 }}
								className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6"
								onClick={(e) => e.stopPropagation()}
							>
								<div className="flex justify-center mb-4">
									<div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
										<AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
									</div>
								</div>
								<h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 text-center mb-2">
									{isArabic ? "مسح جميع المنتجات؟" : "Clear All Products?"}
								</h3>
								<p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-6">
									{isArabic
										? "هل أنت متأكد من أنك تريد مسح جميع المنتجات من السلة؟ لا يمكن التراجع عن هذا الإجراء."
										: "Are you sure you want to clear all products from your cart? This action cannot be undone."}
								</p>
								<div className={`flex gap-3 ${isArabic ? "flex-row-reverse" : ""}`}>
									<button
										onClick={() => setShowClearAllModal(false)}
										disabled={isUpdating}
										className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
									>
										{isArabic ? "إلغاء" : "Cancel"}
									</button>
									<button
										onClick={handleClearAll}
										disabled={isUpdating}
										className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
									>
										<Trash2 className="w-4 h-4" />
										<span>{isArabic ? "مسح الكل" : "Clear All"}</span>
									</button>
								</div>
							</motion.div>
						</div>
					</>
				)}
			</AnimatePresence>

			{/* Checkout Confirmation Modal */}
			<ConfirmCheckoutModal
				isOpen={showCheckoutModal}
				language={language}
				isProcessing={isProcessing}
				onConfirm={handleCheckoutConfirm}
				onCancel={() => setShowCheckoutModal(false)}
				orderSummary={orderSummary}
			/>

			{/* Toast Container */}
			<ToastContainer toasts={toasts} onRemoveToast={removeToast} isArabic={isArabic} />
		</div>
	);
}

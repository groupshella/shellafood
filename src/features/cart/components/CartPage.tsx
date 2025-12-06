"use client";

import React from "react";
import { Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { ToastContainer } from "@/shared/components/ui";
import { useCartPage } from "../hooks/useCartPage";

// Import components
import CouponSection from "./coupon/CouponSection";
import AddressSelector from "./address/AddressSelector";
import PaymentSection from "./payment/PaymentSection";
import OrderSummary from "./checkout/OrderSummary";
import EmptyCartState from "./cart-items/EmptyCartState";
import { CartLoadingSkeleton } from "./skeleton/CartLoadingSkeleton";
import ConfirmCheckoutModal from "./modals/ConfirmCheckoutModal";
import ClearAllModal from "./modals/ClearAllModal";
import CartHeader from "./header/CartHeader";
import PromoBanner from "./header/PromoBanner";
import GroupedCartItems from "./cart-items/GroupedCartItems";

export default function CartPage() {
	const {
		language,
		isArabic,
		toasts,
		removeToast,
		showCheckoutModal,
		showClearAllModal,
		setShowCheckoutModal,
		setShowClearAllModal,
		items,
		isLoading,
		isUpdating,
		productsByStore,
		updateQuantity,
		removeItem,
		appliedCoupon,
		isApplyingCoupon,
		couponError,
		applyCoupon,
		removeCoupon,
		addresses,
		selectedAddressId,
		isAddressLoading,
		selectAddress,
		saveNewAddress,
		deleteAddressById,
		selectedPaymentMethod,
		cardDetails,
		selectPaymentMethod,
		updateCardDetails,
		formatCardNumber,
		formatExpiryDate,
		formatCVV,
		calculations,
		orderSummary,
		remainingForFreeDelivery,
		showPromoBanner,
		canCheckout,
		isProcessing,
		handleCheckoutClick,
		handleCheckoutConfirm,
		handleClearAll,
		handleContinueShopping,
	} = useCartPage();

	// Empty state
	if (!isLoading && items.length === 0) {
		return (
			<>
				<EmptyCartState language={language} />
				<ToastContainer toasts={toasts} onRemoveToast={removeToast} isArabic={isArabic} />
			</>
		);
	}

	return (
		<div
			className={`min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 ${isArabic ? "rtl" : "ltr"}`}
			dir={isArabic ? "rtl" : "ltr"}
		>
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
				{/* Header */}
				<CartHeader
					itemsCount={calculations.itemsCount}
					isArabic={isArabic}
					onContinueShopping={handleContinueShopping}
				/>

				{/* Promo Banner */}
				{showPromoBanner && (
					<PromoBanner
						remainingForFreeDelivery={remainingForFreeDelivery}
						isArabic={isArabic}
					/>
				)}

				{isLoading ? (
					<CartLoadingSkeleton />
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
										className={`flex items-center gap-2 px-4 py-2.5 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${isArabic ? 'flex-row-reverse' : ''}`}
									>
										<Trash2 className="w-4 h-4" />
										<span className="text-sm">{isArabic ? 'مسح الكل' : 'Clear All'}</span>
									</button>
								</motion.div>
							)}

							{/* Products Section with Store Grouping */}
							{items.length > 0 && (
								<GroupedCartItems
									productsByStore={productsByStore}
									language={language}
									onUpdateQuantity={updateQuantity}
									onRemove={removeItem}
								/>
							)}
						</div>

						{/* Right Column - Summary & Options */}
						<div className="lg:col-span-1 space-y-6">
							{/* Coupon Section */}
							<CouponSection
								language={language}
								appliedCoupon={appliedCoupon}
								isApplying={isApplyingCoupon}
								error={couponError}
								onApply={async (code) => {
									await applyCoupon(code);
								}}
								onRemove={removeCoupon}
							/>

							{/* Address Selector */}
							<AddressSelector
								language={language}
								addresses={addresses}
								selectedAddressId={selectedAddressId}
								isLoading={isAddressLoading}
								onAddressSelect={selectAddress}
								onSaveAddress={saveNewAddress}
								onDeleteAddress={deleteAddressById}
							/>

							{/* Payment Options */}
							<PaymentSection
								language={language}
								selectedMethod={selectedPaymentMethod}
								cardDetails={cardDetails}
								onMethodSelect={selectPaymentMethod}
								onCardDetailsChange={(details) => updateCardDetails(details)}
								formatCardNumber={formatCardNumber}
								formatExpiryDate={formatExpiryDate}
								formatCVV={formatCVV}
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
			<ClearAllModal
				isOpen={showClearAllModal}
				onClose={() => setShowClearAllModal(false)}
				onConfirm={handleClearAll}
				isLoading={isUpdating}
				isArabic={isArabic}
			/>

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

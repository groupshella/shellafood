"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Shield } from "lucide-react";
import OrderSummaryDetails from "./OrderSummaryDetails";

interface OrderSummaryProps {
	language: "en" | "ar";
	subtotal: number;
	deliveryFee: number;
	discount: number;
	couponDiscount?: number;
	total: number;
	isLoading?: boolean;
	onCheckout: () => void;
	canCheckout?: boolean;
	estimatedDeliveryTime?: string;
	estimatedDeliveryTimeAr?: string;
	freeDeliveryThreshold?: number;
}

export default function OrderSummary({
	language,
	subtotal,
	deliveryFee,
	discount,
	couponDiscount = 0,
	total,
	isLoading = false,
	onCheckout,
	canCheckout = true,
	estimatedDeliveryTime,
	estimatedDeliveryTimeAr,
	freeDeliveryThreshold = 100,
}: OrderSummaryProps) {
	const isArabic = language === "ar";
	const totalDiscount = discount + couponDiscount;
	const [showDetails, setShowDetails] = useState(false);
	const [isExpanded, setIsExpanded] = useState(false);
	const [isSticky, setIsSticky] = useState(false);

	const amountNeeded = Math.max(0, freeDeliveryThreshold - subtotal);
	const savings = totalDiscount;

	// Handle sticky positioning
	useEffect(() => {
		if (typeof window === 'undefined') return;
		
		const handleScroll = () => {
			const shouldBeSticky = window.scrollY > 100;
			setIsSticky(shouldBeSticky);
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className={`bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-5 sm:p-6 ${
				isSticky ? "lg:sticky lg:top-6" : ""
			}`}
		>
			<div className="flex items-center justify-between mb-6">
				<h3 className={`text-xl font-bold text-gray-900 dark:text-gray-100 ${isArabic ? "text-right" : "text-left"}`}>
					{isArabic ? "ملخص الطلب" : "Order Summary"}
				</h3>
				<motion.button
					whileHover={{ scale: 1.1 }}
					whileTap={{ scale: 0.9 }}
					onClick={() => setIsExpanded(!isExpanded)}
					className="lg:hidden p-1.5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
					aria-label={isArabic ? "تفاصيل" : "Details"}
				>
					{isExpanded ? (
						<ChevronUp className="w-5 h-5" />
					) : (
						<ChevronDown className="w-5 h-5" />
					)}
				</motion.button>
			</div>

			<AnimatePresence>
				{(isExpanded || (typeof window !== 'undefined' && window.innerWidth >= 1024)) && (
					<OrderSummaryDetails
						subtotal={subtotal}
						deliveryFee={deliveryFee}
						totalDiscount={totalDiscount}
						couponDiscount={couponDiscount}
						total={total}
						savings={savings}
						amountNeeded={amountNeeded}
						freeDeliveryThreshold={freeDeliveryThreshold}
						estimatedDeliveryTime={estimatedDeliveryTime}
						estimatedDeliveryTimeAr={estimatedDeliveryTimeAr}
						isArabic={isArabic}
					/>
				)}
			</AnimatePresence>

			{/* Checkout Button */}
			<motion.button
				whileHover={canCheckout && !isLoading ? { scale: 1.02, boxShadow: "0 10px 25px rgba(16, 185, 129, 0.3)" } : {}}
				whileTap={canCheckout && !isLoading ? { scale: 0.98 } : {}}
				onClick={onCheckout}
				disabled={!canCheckout || isLoading}
				className={`w-full py-4 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
					isArabic ? "flex-row-reverse" : ""
				}`}
			>
				{isLoading ? (
					<>
						<motion.div
							animate={{ rotate: 360 }}
							transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
							className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
						/>
						<span>{isArabic ? "جاري المعالجة..." : "Processing..."}</span>
					</>
				) : (
					<>
						<span>{isArabic ? "تأكيد الطلب" : "Confirm & Checkout"}</span>
						<motion.div
							animate={{ x: [0, isArabic ? -4 : 4, 0] }}
							transition={{ duration: 1.5, repeat: Infinity }}
						>
							→
						</motion.div>
					</>
				)}
			</motion.button>

			{/* Security Note */}
			<div className={`flex items-center justify-center gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700`}>
				<Shield className="w-4 h-4 text-gray-400 dark:text-gray-500" />
				<p className={`text-xs text-gray-500 dark:text-gray-400 text-center ${isArabic ? "text-right" : "text-left"}`}>
					{isArabic
						? "🔒 معالجة آمنة ومشفرة لبياناتك"
						: "🔒 Secure encrypted processing of your data"}
				</p>
			</div>
		</motion.div>
	);
}

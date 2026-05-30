"use client";

import React from "react";
import { motion } from "framer-motion";
import { Truck, Sparkles, TrendingDown } from "lucide-react";

interface OrderSummaryDetailsProps {
	subtotal: number;
	deliveryFee: number;
	totalDiscount: number;
	couponDiscount: number;
	total: number;
	savings: number;
	amountNeeded: number;
	freeDeliveryThreshold: number;
	estimatedDeliveryTime?: string;
	estimatedDeliveryTimeAr?: string;
	isArabic: boolean;
}

export default function OrderSummaryDetails({
	subtotal,
	deliveryFee,
	totalDiscount,
	couponDiscount,
	total,
	savings,
	amountNeeded,
	freeDeliveryThreshold,
	estimatedDeliveryTime,
	estimatedDeliveryTimeAr,
	isArabic,
}: OrderSummaryDetailsProps) {
	return (
		<motion.div
			initial={{ height: 0, opacity: 0 }}
			animate={{ height: "auto", opacity: 1 }}
			exit={{ height: 0, opacity: 0 }}
			className="space-y-3 mb-6 overflow-hidden"
		>
			{/* Subtotal */}
			<div className={`flex items-center justify-between`}>
				<span className="text-sm text-gray-600 dark:text-gray-400">{isArabic ? "المجموع الفرعي:" : "Subtotal:"}</span>
				<motion.span
					key={subtotal}
					initial={{ scale: 1.1, color: "#10b981" }}
					animate={{ scale: 1, color: "inherit" }}
					transition={{ duration: 0.3 }}
					className="text-sm font-semibold text-gray-900 dark:text-gray-100"
				>
					{subtotal.toFixed(2)} {isArabic ? "ريال" : "SAR"}
				</motion.span>
			</div>

			{/* Delivery Fee */}
			{deliveryFee > 0 && (
				<div className={`flex items-center justify-between`}>
					<span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1.5">
						<Truck className="w-4 h-4" />
						{isArabic ? "رسوم التوصيل:" : "Delivery Fee:"}
					</span>
					<span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
						{deliveryFee.toFixed(2)} {isArabic ? "ريال" : "SAR"}
					</span>
				</div>
			)}

			{/* Free Delivery Progress */}
			{subtotal < freeDeliveryThreshold && deliveryFee > 0 && (
				<motion.div
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					className="p-3 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg"
				>
					<div className="flex items-center gap-2 mb-2">
						<Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
						<span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">
							{isArabic
								? `أضف ${amountNeeded.toFixed(2)} ريال للحصول على توصيل مجاني`
								: `Add ${amountNeeded.toFixed(2)} SAR for free delivery`}
						</span>
					</div>
					<div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
						<motion.div
							initial={{ width: 0 }}
							animate={{ width: `${Math.min((subtotal / freeDeliveryThreshold) * 100, 100)}%` }}
							transition={{ duration: 0.5 }}
							className="h-full bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"
						/>
					</div>
				</motion.div>
			)}

			{/* Discount */}
			{totalDiscount > 0 && (
				<motion.div
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					className={`flex items-center justify-between text-emerald-600 dark:text-emerald-400`}
				>
					<span className="text-sm font-medium flex items-center gap-1.5">
						<TrendingDown className="w-4 h-4" />
						{isArabic ? "الخصم:" : "Discount:"}
						{couponDiscount > 0 && (
							<span className="text-xs opacity-75">
								({isArabic ? "كوبون" : "coupon"})
							</span>
						)}
					</span>
					<span className="text-sm font-bold">-{totalDiscount.toFixed(2)} {isArabic ? "ريال" : "SAR"}</span>
				</motion.div>
			)}

			{/* Savings Message */}
			{savings > 0 && (
				<motion.div
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					className="p-3 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg"
				>
					<div className="flex items-center gap-2">
						<Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
						<span className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
							{isArabic
								? `أنت توفر ${savings.toFixed(2)} ريال! 🎉`
								: `You're saving ${savings.toFixed(2)} SAR! 🎉`}
						</span>
					</div>
				</motion.div>
			)}

			{/* Estimated Delivery Time */}
			{estimatedDeliveryTime && (
				<div className={`flex items-center gap-2 pt-2 border-t border-gray-200 dark:border-gray-700`}>
					<Truck className="w-4 h-4 text-gray-500 dark:text-gray-400" />
					<span className="text-xs text-gray-600 dark:text-gray-400">
						{isArabic ? "الوقت المتوقع للتوصيل: " : "Estimated delivery: "}
						{isArabic && estimatedDeliveryTimeAr ? estimatedDeliveryTimeAr : estimatedDeliveryTime}
					</span>
				</div>
			)}

			{/* Divider */}
			<div className="border-t-2 border-gray-200 dark:border-gray-700 my-4" />

			{/* Total */}
			<div className={`flex items-center justify-between`}>
				<span className="text-lg font-bold text-gray-900 dark:text-gray-100">{isArabic ? "الإجمالي:" : "Total:"}</span>
				<motion.span
					key={total}
					initial={{ scale: 1.2, color: "#10b981" }}
					animate={{ scale: 1, color: "#10b981" }}
					transition={{ duration: 0.3 }}
					className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400"
				>
					{total.toFixed(2)} {isArabic ? "ريال" : "SAR"}
				</motion.span>
			</div>
		</motion.div>
	);
}


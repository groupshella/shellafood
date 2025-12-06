"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import type { Coupon } from "../../types/cart.types";

interface AppliedCouponDisplayProps {
	coupon: Coupon;
	isArabic: boolean;
	onRemove: () => void;
	getDiscountText: (coupon: Coupon) => string;
}

export default function AppliedCouponDisplay({ 
	coupon, 
	isArabic, 
	onRemove, 
	getDiscountText 
}: AppliedCouponDisplayProps) {
	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.9 }}
			animate={{ opacity: 1, scale: 1 }}
			className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border-2 border-emerald-200 dark:border-emerald-800 rounded-xl"
		>
			<div className="flex items-center gap-3 flex-1">
				<motion.div
					initial={{ scale: 0 }}
					animate={{ scale: 1 }}
					transition={{ type: "spring", duration: 0.5 }}
					className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0 shadow-lg"
				>
					<Check className="w-5 h-5 text-white" />
				</motion.div>
				<div className="flex-1 min-w-0">
					<p className="text-sm font-bold text-emerald-900 dark:text-emerald-300">
						{isArabic ? coupon.titleAr || coupon.titleEn : coupon.titleEn}
					</p>
					<p className="text-xs text-emerald-700 dark:text-emerald-400 mt-0.5">
						{getDiscountText(coupon)}
					</p>
				</div>
			</div>
			<motion.button
				whileHover={{ scale: 1.1, rotate: 90 }}
				whileTap={{ scale: 0.9 }}
				onClick={onRemove}
				className="p-2 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 rounded-lg transition-colors flex-shrink-0"
				aria-label={isArabic ? "إزالة الكوبون" : "Remove coupon"}
			>
				<X className="w-5 h-5" />
			</motion.button>
		</motion.div>
	);
}


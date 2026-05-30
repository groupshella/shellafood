"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShoppingCart, ArrowLeft } from "lucide-react";

interface CartHeaderProps {
	itemsCount: number;
	isArabic?: boolean;
	onContinueShopping: () => void;
}

export default function CartHeader({
	itemsCount,
	isArabic = false,
	onContinueShopping,
}: CartHeaderProps) {
	return (
		<motion.div
			initial={{ opacity: 0, y: -20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
			className={`mb-6 sm:mb-8 ${isArabic ? 'text-right' : 'text-left'}`}
		>
			<div className="flex items-center justify-between mb-4">
				<div className={`flex items-center gap-3`}>
					<motion.div
						whileHover={{ scale: 1.05, rotate: -5 }}
						whileTap={{ scale: 0.95 }}
						className="relative"
					>
						<ShoppingCart className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-600 dark:text-emerald-400" />
						{itemsCount > 0 && (
							<motion.div
								initial={{ scale: 0 }}
								animate={{ scale: 1 }}
								className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 dark:bg-emerald-400 rounded-full flex items-center justify-center"
							>
								<span className="text-xs font-bold text-white">{itemsCount}</span>
							</motion.div>
						)}
					</motion.div>
					<div>
						<h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-gray-100">
							{isArabic ? 'سلة التسوق' : 'Shopping Cart'}
						</h1>
						<p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
							{isArabic
								? `${itemsCount} ${itemsCount === 1 ? 'عنصر' : 'عناصر'} في السلة`
								: `${itemsCount} ${itemsCount === 1 ? 'item' : 'items'} in cart`}
						</p>
					</div>
				</div>
				<motion.button
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					onClick={onContinueShopping}
					className={`flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors ${isArabic ? 'flex-row-reverse' : ''}`}
				>
					<ArrowLeft className={`w-5 h-5 ${isArabic ? 'rotate-180' : ''}`} />
					<span className="text-sm font-medium">{isArabic ? 'متابعة التسوق' : 'Continue Shopping'}</span>
				</motion.button>
			</div>
		</motion.div>
	);
}


"use client";

import React, { useState, memo } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Trash2, Store, AlertCircle, Plus, Minus } from "lucide-react";
import type { CartItem } from "../../types/cart.types";
import ConfirmRemoveItemModal from "../modals/ConfirmRemoveItemModal";

interface CartItemCardProps {
	item: CartItem;
	language: "en" | "ar";
	onUpdateQuantity: (itemId: string, priceAtAdd: number, quantity: number) => Promise<void>;
	onRemove: (itemId: string) => Promise<void>;
	isUpdating?: boolean;
	isRemoving?: boolean;
}

function CartItemCard({ 
	item, 
	language, 
	onUpdateQuantity, 
	onRemove,
	isUpdating = false,
	isRemoving = false,
}: CartItemCardProps) {
	const isArabic = language === "ar";
	const [showConfirmRemove, setShowConfirmRemove] = useState(false);
	const [isUpdatingQuantity, setIsUpdatingQuantity] = useState(false);

	// Calculations
	const unitPrice = item.priceAtAdd;
	const subtotal = unitPrice * item.quantity;
	const lowStock = item.stock !== undefined && item.stock < item.quantity;

	// Handlers
	const handleQuantityChange = async (newQuantity: number) => {
		setIsUpdatingQuantity(true);
		if (newQuantity < 1) {
			setShowConfirmRemove(true);
			return;
		}
		await onUpdateQuantity(item.id, unitPrice, newQuantity);
		setIsUpdatingQuantity(false);
	};

	const handleDecrease = () => {
		handleQuantityChange(item.quantity - 1);
	};

	const handleIncrease = () => {
		handleQuantityChange(item.quantity + 1);
	};

	const handleRemove = async () => {
		await onRemove(item.id);
		setShowConfirmRemove(false);
	};

	return (
		<>
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
			>
				<div className="p-4 sm:p-5">
					<div className="flex items-start gap-4">
						{/* Product Image */}
						<div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-700 flex-shrink-0">
							{item.productImage ? (
								<Image
									src={item.productImage}
									alt={isArabic ? item.productNameAr || item.productName : item.productName}
									fill
									className="object-cover"
								/>
							) : (
								<div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
									<Store className="w-8 h-8 text-gray-400 dark:text-gray-500" />
								</div>
							)}
						</div>

						{/* Product Info */}
						<div className="flex-1 min-w-0">
							<h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-1 line-clamp-2">
								{isArabic ? item.productNameAr || item.productName : item.productName}
							</h3>
							<div className="flex items-center gap-2 mb-2">
								<p className="text-sm text-gray-600 dark:text-gray-400">
									{isArabic ? item.storeNameAr || item.storeName : item.storeName}
								</p>
								{item.unit && (
									<>
										<span className="text-gray-400 dark:text-gray-500">•</span>
										<p className="text-xs text-gray-500 dark:text-gray-400">
											{isArabic ? item.unitAr || item.unit : item.unit}
										</p>
									</>
								)}
							</div>

							{/* Low Stock Warning */}
							{lowStock && (
								<motion.div
									initial={{ opacity: 0, y: -5 }}
									animate={{ opacity: 1, y: 0 }}
									className="flex items-center gap-1.5 mb-2 text-orange-600 dark:text-orange-400"
								>
									<AlertCircle className="w-4 h-4" />
									<span className="text-xs font-medium">
										{isArabic ? "مخزون محدود" : "Low stock"}
									</span>
								</motion.div>
							)}

							{/* Quantity Controls */}
						{isUpdatingQuantity ? <div className="flex items-center gap-3 mt-3">
							<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
						</div> 
						: <div className="flex items-center gap-3 mt-3">
								<div className="flex items-center gap-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg">
									<motion.button
										whileHover={{ scale: 1.1 }}
										whileTap={{ scale: 0.9 }}
										onClick={handleDecrease}
										disabled={isUpdating || item.quantity <= 1}
										className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
										aria-label={isArabic ? "تقليل الكمية" : "Decrease quantity"}
									>
										<Minus className="w-4 h-4" />
									</motion.button>
									<span className="px-3 py-1 text-sm font-semibold text-gray-900 dark:text-gray-100 min-w-[2rem] text-center">
										{item.quantity}
									</span>
									<motion.button
										whileHover={{ scale: 1.1 }}
										whileTap={{ scale: 0.9 }}
										onClick={handleIncrease}
										disabled={isUpdating || (item.stock !== undefined && item.quantity >= item.stock)}
										className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
										aria-label={isArabic ? "زيادة الكمية" : "Increase quantity"}
									>
										<Plus className="w-4 h-4" />
									</motion.button>
								</div>

								{/* Remove Button */}
								<motion.button
									whileHover={{ scale: 1.1 }}
									whileTap={{ scale: 0.9 }}
									onClick={() => setShowConfirmRemove(true)}
									disabled={isRemoving}
									className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
									aria-label={isArabic ? "إزالة المنتج" : "Remove product"}
								>
									<Trash2 className="w-4 h-4" />
								</motion.button>
							</div>}


						</div>

						{/* Price */}
						<div className={`text-right flex-shrink-0 ${isArabic ? "text-left" : "text-right"}`}>
							{item.hasSpecialOffer && item.originalPrice && (
								<p className="text-xs text-gray-500 dark:text-gray-400 line-through mb-1">
									{(item.originalPrice * item.quantity).toFixed(2)} {isArabic ? "ريال" : "SAR"}
								</p>
							)}
							<p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
								{subtotal.toFixed(2)} {isArabic ? "ريال" : "SAR"}
							</p>
							<p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
								{unitPrice.toFixed(2)} {isArabic ? "ريال" : "SAR"} {isArabic ? "لكل" : "each"}
							</p>
						</div>
					</div>
				</div>
			</motion.div>

			{/* Confirm Remove Modal */}
			<ConfirmRemoveItemModal
				isOpen={showConfirmRemove}
				isArabic={isArabic}
				isRemoving={isRemoving}
				onClose={() => setShowConfirmRemove(false)}
				onConfirm={handleRemove}
			/>
		</>
	);
}

export default memo(CartItemCard);

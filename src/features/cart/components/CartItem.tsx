'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Trash2, Store, AlertCircle, Plus, Minus } from 'lucide-react';
import type { CartItem as CartItemType } from '../types/cart.types';

interface CartItemProps {
	item: CartItemType;
	language: 'en' | 'ar';
	isUpdating?: boolean;
	onUpdateQuantity: (cartId: string, priceAtAdd: number, quantity: number) => Promise<Boolean>;
	onRemove: (cartId: string) => Promise<Boolean>;
}

export default function CartItem({
	item,
	language,
	isUpdating = false,
	onUpdateQuantity,
	onRemove,
}: CartItemProps) {
	const isArabic = language === 'ar';
	const [showConfirm, setShowConfirm] = useState(false);
	const [localUpdating, setLocalUpdating] = useState(false);

	const unitPrice = item.priceAtAdd;
	const subtotal = unitPrice * item.quantity;
	const lowStock = item.stock !== undefined && item.stock < item.quantity;

	const handleChange = async (newQty: number) => {
		if (newQty < 1) {
			setShowConfirm(true);
			return;
		}
		setLocalUpdating(true);
		await onUpdateQuantity(item.id, unitPrice, newQty);
		setLocalUpdating(false);
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
						{/* Image */}
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

						{/* Info */}
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

							{lowStock && (
								<div className="flex items-center gap-1.5 mb-2 text-orange-600 dark:text-orange-400">
									<AlertCircle className="w-4 h-4" />
									<span className="text-xs font-medium">
										{isArabic ? 'مخزون محدود' : 'Low stock'}
									</span>
								</div>
							)}

							{/* Quantity */}
							{localUpdating ? (
								<div className="flex items-center gap-3 mt-3">
									<div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
								</div>
							) : (
								<div className="flex items-center gap-3 mt-3">
									<div className="flex items-center gap-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg">
										<motion.button
											whileHover={{ scale: 1.1 }}
											whileTap={{ scale: 0.9 }}
											onClick={() => handleChange(item.quantity - 1)}
											disabled={isUpdating || item.quantity <= 1}
											className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 disabled:opacity-50 transition-colors"
										>
											<Minus className="w-4 h-4" />
										</motion.button>
										<span className="px-3 py-1 text-sm font-semibold text-gray-900 dark:text-gray-100 min-w-[2rem] text-center">
											{item.quantity}
										</span>
										<motion.button
											whileHover={{ scale: 1.1 }}
											whileTap={{ scale: 0.9 }}
											onClick={() => handleChange(item.quantity + 1)}
											disabled={isUpdating || (item.stock !== undefined && item.quantity >= item.stock)}
											className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 disabled:opacity-50 transition-colors"
										>
											<Plus className="w-4 h-4" />
										</motion.button>
									</div>

									<motion.button
										whileHover={{ scale: 1.1 }}
										whileTap={{ scale: 0.9 }}
										onClick={() => setShowConfirm(true)}
										disabled={isUpdating}
										className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
									>
										<Trash2 className="w-4 h-4" />
									</motion.button>
								</div>
							)}
						</div>

						{/* Price */}
						<div className={`text-right flex-shrink-0 ${isArabic ? 'text-left' : 'text-right'}`}>
							{item.hasSpecialOffer && item.originalPrice && (
								<p className="text-xs text-gray-500 dark:text-gray-400 line-through mb-1">
									{(item.originalPrice * item.quantity).toFixed(2)} {isArabic ? 'ريال' : 'SAR'}
								</p>
							)}
							<p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
								{subtotal.toFixed(2)} {isArabic ? 'ريال' : 'SAR'}
							</p>
							<p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
								{unitPrice.toFixed(2)} {isArabic ? 'ريال' : 'SAR'} {isArabic ? 'لكل' : 'each'}
							</p>
						</div>
					</div>
				</div>
			</motion.div>

			{/* Inline confirm remove */}
			{showConfirm && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
					<motion.div
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 max-w-sm w-full"
					>
						<h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 text-center mb-2">
							{isArabic ? 'إزالة المنتج؟' : 'Remove Product?'}
						</h3>
						<p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-6">
							{isArabic
								? 'هل أنت متأكد من أنك تريد إزالة هذا المنتج من السلة؟'
								: 'Are you sure you want to remove this product from your cart?'}
						</p>
						<div className={`flex gap-3 ${isArabic ? 'flex-row-reverse' : ''}`}>
							<button
								onClick={() => setShowConfirm(false)}
								className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 rounded-xl font-semibold transition-all"
							>
								{isArabic ? 'إلغاء' : 'Cancel'}
							</button>
							<button
								onClick={async () => {
									await onRemove(item.id);
									setShowConfirm(false);
								}}
								className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
							>
								<Trash2 className="w-4 h-4" />
								<span>{isArabic ? 'إزالة' : 'Remove'}</span>
							</button>
						</div>
					</motion.div>
				</div>
			)}
		</>
	);
}
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, ArrowLeft, ShoppingBag, AlertTriangle } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import CartItem from './CartItem';
import CartSummary from './CartSummary';
import CartEmptyState from './CartEmptyState';
import type { CartItem as CartItemType } from '../types/cart.types';

interface CartDrawerProps { }

export default function CartDrawer({ }: CartDrawerProps) {
	const router = useRouter();
	const {
		items,
		isLoading,
		isUpdating,
		isArabic,
		language,
		calculations,
		updateQuantity,
		removeItem,
		clearAll,
	} = useCart();

	const [showClearModal, setShowClearModal] = useState(false);

	if (!isLoading && items.length === 0) {
		return <CartEmptyState language={language} />;
	}

	return (
		<div
			className={`min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 ${isArabic ? 'rtl' : 'ltr'
				}`}
			dir={isArabic ? 'rtl' : 'ltr'}
		>
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
				{/* Header */}
				<div className="flex items-center justify-between mb-6">
					<div className="flex items-center gap-3">
						<button
							onClick={() => router.push('/categories')}
							className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
						>
							<ArrowLeft className={`w-5 h-5 text-gray-600 dark:text-gray-400 ${isArabic ? 'rotate-180' : ''}`} />
						</button>
						<h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
							<ShoppingBag className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
							{isArabic ? 'سلة التسوق' : 'Shopping Cart'}
							<span className="text-sm font-normal text-gray-500 dark:text-gray-400">
								({calculations.itemsCount} {isArabic ? 'منتج' : 'items'})
							</span>
						</h1>
					</div>
				</div>

				{/* Free delivery promo */}
				{items.length > 0 && calculations.remainingForFreeDelivery > 0 && (
					<motion.div
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						className="mb-6 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4 flex items-center gap-3"
					>
						<div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
							<ShoppingBag className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
						</div>
						<p className="text-sm text-emerald-800 dark:text-emerald-300">
							{isArabic
								? `أضف ${calculations.remainingForFreeDelivery.toFixed(2)} ريال أخرى للحصول على توصيل مجاني!`
								: `Add ${calculations.remainingForFreeDelivery.toFixed(2)} SAR more for free delivery!`}
						</p>
					</motion.div>
				)}

				{isLoading ? (
					<div className="space-y-4">
						{[...Array(3)].map((_, i) => (
							<div
								key={i}
								className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 h-32 animate-pulse"
							/>
						))}
					</div>
				) : (
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
						{/* Items Column */}
						<div className="lg:col-span-2 space-y-6">
							{/* Clear All */}
							{items.length > 0 && (
								<motion.div
									initial={{ opacity: 0, y: -10 }}
									animate={{ opacity: 1, y: 0 }}
									className="flex justify-end"
								>
									<button
										onClick={() => setShowClearModal(true)}
										disabled={isUpdating}
										className={`flex items-center gap-2 px-4 py-2.5 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl font-semibold transition-all disabled:opacity-50 ${isArabic ? 'flex-row-reverse' : ''
											}`}
									>
										<Trash2 className="w-4 h-4" />
										<span className="text-sm">{isArabic ? 'مسح الكل' : 'Clear All'}</span>
									</button>
								</motion.div>
							)}

							{/* Items List (no store grouping) */}
							<div className="space-y-4">
								<AnimatePresence mode="popLayout">
									{items.map((item: CartItemType) => (
										<motion.div
											key={item.id}
											layout
											initial={{ opacity: 0, scale: 0.95 }}
											animate={{ opacity: 1, scale: 1 }}
											exit={{ opacity: 0, scale: 0.95 }}
										>
											<CartItem
												item={item}
												language={language}
												isUpdating={isUpdating}
												onUpdateQuantity={updateQuantity}
												onRemove={removeItem}
											/>
										</motion.div>
									))}
								</AnimatePresence>
							</div>
						</div>

						{/* Summary Column */}
						<div className="lg:col-span-1">
							<CartSummary
								language={language}
								totals={calculations}

							/>
						</div>
					</div>
				)}
			</div>

			{/* Clear All Modal */}
			<AnimatePresence>
				{showClearModal && (
					<>
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							onClick={() => setShowClearModal(false)}
							className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
						/>
						<div className="fixed inset-0 z-50 flex items-center justify-center p-4" dir={isArabic ? 'rtl' : 'ltr'}>
							<motion.div
								initial={{ opacity: 0, scale: 0.95, y: 20 }}
								animate={{ opacity: 1, scale: 1, y: 0 }}
								exit={{ opacity: 0, scale: 0.95, y: 20 }}
								className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6"
							>
								<div className="flex justify-center mb-4">
									<div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
										<AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
									</div>
								</div>
								<h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 text-center mb-2">
									{isArabic ? 'مسح جميع المنتجات؟' : 'Clear All Products?'}
								</h3>
								<p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-6">
									{isArabic
										? 'هل أنت متأكد من أنك تريد مسح جميع المنتجات من السلة؟ لا يمكن التراجع عن هذا الإجراء.'
										: 'Are you sure you want to clear all products from your cart? This action cannot be undone.'}
								</p>
								<div className={`flex gap-3 ${isArabic ? 'flex-row-reverse' : ''}`}>
									<button
										onClick={() => setShowClearModal(false)}
										disabled={isUpdating}
										className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 rounded-xl font-semibold transition-all disabled:opacity-50"
									>
										{isArabic ? 'إلغاء' : 'Cancel'}
									</button>
									<button
										onClick={async () => {
											await clearAll();
											setShowClearModal(false);
										}}
										disabled={isUpdating}
										className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
									>
										<Trash2 className="w-4 h-4" />
										<span>{isArabic ? 'مسح الكل' : 'Clear All'}</span>
									</button>
								</div>
							</motion.div>
						</div>
					</>
				)}
			</AnimatePresence>
		</div>
	);
}
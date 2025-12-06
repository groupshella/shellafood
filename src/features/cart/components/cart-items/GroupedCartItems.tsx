"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Store as StoreIcon } from "lucide-react";
import CartItemCard from "./CartItemCard";
import type { GroupedItems, CartItem } from "../../types/cart.types";

interface GroupedCartItemsProps {
	productsByStore: GroupedItems;
	language: "en" | "ar";
	onUpdateQuantity: (itemId: string, quantity: number) => Promise<void>;
	onRemove: (itemId: string) => Promise<void>;
}

export default function GroupedCartItems({
	productsByStore,
	language,
	onUpdateQuantity,
	onRemove,
}: GroupedCartItemsProps) {
	const isArabic = language === "ar";

	return (
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
								{storeData.items.length} {isArabic ? 'منتج' : 'product'}
								{storeData.items.length !== 1 ? (isArabic ? 'ات' : 's') : ''}
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
									item={item}
									language={language}
									onUpdateQuantity={onUpdateQuantity}
									onRemove={onRemove}
								/>
							</motion.div>
						))}
					</AnimatePresence>
				</motion.div>
			))}
		</motion.div>
	);
}


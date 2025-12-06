"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Trash2 } from "lucide-react";

interface ClearAllModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	isLoading?: boolean;
	isArabic?: boolean;
}

export default function ClearAllModal({
	isOpen,
	onClose,
	onConfirm,
	isLoading = false,
	isArabic = false,
}: ClearAllModalProps) {
	return (
		<AnimatePresence>
			{isOpen && (
				<>
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={onClose}
						className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
					/>
					<div className="fixed inset-0 z-50 flex items-center justify-center p-4" dir={isArabic ? 'rtl' : 'ltr'}>
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
								{isArabic ? 'مسح جميع المنتجات؟' : 'Clear All Products?'}
							</h3>
							<p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-6">
								{isArabic
									? 'هل أنت متأكد من أنك تريد مسح جميع المنتجات من السلة؟ لا يمكن التراجع عن هذا الإجراء.'
									: 'Are you sure you want to clear all products from your cart? This action cannot be undone.'}
							</p>
							<div className={`flex gap-3 ${isArabic ? 'flex-row-reverse' : ''}`}>
								<button
									onClick={onClose}
									disabled={isLoading}
									className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
								>
									{isArabic ? 'إلغاء' : 'Cancel'}
								</button>
								<button
									onClick={onConfirm}
									disabled={isLoading}
									className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
	);
}


"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2 } from "lucide-react";

interface ConfirmRemoveItemModalProps {
	isOpen: boolean;
	isArabic: boolean;
	isRemoving: boolean;
	onClose: () => void;
	onConfirm: () => void;
}

export default function ConfirmRemoveItemModal({
	isOpen,
	isArabic,
	isRemoving,
	onClose,
	onConfirm,
}: ConfirmRemoveItemModalProps) {
	return (
		<AnimatePresence>
			{isOpen && (
				<>
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
						onClick={onClose}
					/>
					<div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
						<motion.div
							initial={{ opacity: 0, scale: 0.9, y: 20 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							exit={{ opacity: 0, scale: 0.9, y: 20 }}
							className={`bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-sm w-full p-6 pointer-events-auto border border-gray-200 dark:border-gray-700 ${isArabic ? "rtl" : "ltr"}`}
							dir={isArabic ? "rtl" : "ltr"}
							onClick={(e) => e.stopPropagation()}
						>
							<h3 className={`text-lg font-bold text-gray-900 dark:text-gray-100 mb-2 ${isArabic ? "text-right" : "text-left"}`}>
								{isArabic ? "إزالة المنتج؟" : "Remove Product?"}
							</h3>
							<p className={`text-sm text-gray-600 dark:text-gray-400 mb-6 ${isArabic ? "text-right" : "text-left"}`}>
								{isArabic
									? "هل أنت متأكد من أنك تريد إزالة هذا المنتج من السلة؟"
									: "Are you sure you want to remove this product from your cart?"}
							</p>
							<div className={`flex gap-3 ${isArabic ? "flex-row-reverse" : ""}`}>
								<button
									onClick={onClose}
									disabled={isRemoving}
									className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 rounded-lg font-semibold transition-colors disabled:opacity-50"
								>
									{isArabic ? "إلغاء" : "Cancel"}
								</button>
								<button
									onClick={onConfirm}
									disabled={isRemoving}
									className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
								>
									{isRemoving ? (
										<motion.div
											animate={{ rotate: 360 }}
											transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
											className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
										/>
									) : (
										<Trash2 className="w-4 h-4" />
									)}
									<span>{isArabic ? "إزالة" : "Remove"}</span>
								</button>
							</div>
						</motion.div>
					</div>
				</>
			)}
		</AnimatePresence>
	);
}


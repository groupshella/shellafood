"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, HelpCircle } from "lucide-react";

interface QuickTipsBannerProps {
	hasPickup: boolean;
	hasDropoff: boolean;
	hasPackage: boolean;
	isReviewMode: boolean;
	isArabic: boolean;
}

export const QuickTipsBanner: React.FC<QuickTipsBannerProps> = ({
	hasPickup,
	hasDropoff,
	hasPackage,
	isReviewMode,
	isArabic,
}) => {
	const [showQuickTips, setShowQuickTips] = useState(false);
	const quickTipsRef = useRef<HTMLDivElement>(null);
	const needsHelp = !hasPickup || !hasDropoff || !hasPackage;

	// Close tooltip when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (quickTipsRef.current && !quickTipsRef.current.contains(event.target as Node)) {
				setShowQuickTips(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	if (!needsHelp || isReviewMode) return null;

	return (
		<motion.div
			ref={quickTipsRef}
			initial={{ opacity: 0, y: -10 }}
			animate={{ opacity: 1, y: 0 }}
			className="mb-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-2 sm:p-3"
		>
			<div className="flex items-center justify-between gap-2">
				<div className="flex items-center gap-1.5 sm:gap-2 flex-1">
					<Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
					<p className="text-[10px] sm:text-xs font-medium text-blue-900 dark:text-blue-100">
						{isArabic 
							? "انقر على المسار لإكمال التفاصيل بسرعة" 
							: "Click on the segment to quickly complete details"
						}
					</p>
				</div>
				<button
					onClick={(e) => {
						e.stopPropagation();
						setShowQuickTips(!showQuickTips);
					}}
					className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors p-1 touch-manipulation"
					aria-label={isArabic ? "عرض النصائح" : "Show tips"}
				>
					<HelpCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
				</button>
			</div>
			<AnimatePresence>
				{showQuickTips && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: "auto" }}
						exit={{ opacity: 0, height: 0 }}
						className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-700 space-y-2"
					>
						{!hasPickup && (
							<div className="flex items-start gap-2 text-xs text-blue-800 dark:text-blue-200">
								<span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
								<span>{isArabic ? "حدد نقطة الالتقاط من الخريطة" : "Select pickup point from the map"}</span>
							</div>
						)}
						{!hasDropoff && (
							<div className="flex items-start gap-2 text-xs text-blue-800 dark:text-blue-200">
								<span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
								<span>{isArabic ? "حدد نقطة التوصيل من الخريطة" : "Select dropoff point from the map"}</span>
							</div>
						)}
						{!hasPackage && (
							<div className="flex items-start gap-2 text-xs text-blue-800 dark:text-blue-200">
								<span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
								<span>{isArabic ? "أضف تفاصيل الطرد (الوصف، الوزن، إلخ)" : "Add package details (description, weight, etc.)"}</span>
							</div>
						)}
					</motion.div>
				)}
			</AnimatePresence>
		</motion.div>
	);
};


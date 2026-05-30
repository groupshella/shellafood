"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface PromoBannerProps {
	remainingForFreeDelivery: number;
	isArabic?: boolean;
}

export default function PromoBanner({
	remainingForFreeDelivery,
	isArabic = false,
}: PromoBannerProps) {
	return (
		<motion.div
			initial={{ opacity: 0, y: -10 }}
			animate={{ opacity: 1, y: 0 }}
			className="flex items-center gap-2 p-3 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl mb-6"
		>
			<Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
			<p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
				{isArabic
					? `أضف ${remainingForFreeDelivery.toFixed(2)} ريال أخرى للحصول على توصيل مجاني!`
					: `Add ${remainingForFreeDelivery.toFixed(2)} SAR more for free delivery!`}
			</p>
		</motion.div>
	);
}


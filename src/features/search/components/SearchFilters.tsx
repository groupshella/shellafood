"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { useLanguage } from "@/providers";
import type { StoreType } from "../types/search.types";

interface SearchFiltersProps {
	activeType: StoreType;
	onChange: (type: StoreType) => void;
	visible?: boolean;
}

// Only what the backend accepts: all | veg | non_veg
const TYPES: { value: StoreType; labelEn: string; labelAr: string; emoji: string }[] = [
	{ value: "all", labelEn: "All", labelAr: "الكل", emoji: "🍽️" },
	{ value: "veg", labelEn: "Vegetarian", labelAr: "نباتي", emoji: "🥗" },
	{ value: "non_veg", labelEn: "Non-Veg", labelAr: "غير نباتي", emoji: "🍖" },
];

export default function SearchFilters({
	activeType,
	onChange,
	visible = true,
}: SearchFiltersProps) {
	const { language } = useLanguage();
	const isAr = language === "ar";

	if (!visible) return null;

	return (
		<motion.div
			initial={{ opacity: 0, y: 8 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
			className={`flex items-center gap-2 mb-6 ${isAr ? "justify-end" : ""}`}
			role="group"
			aria-label={isAr ? "تصفية النوع" : "Filter by type"}
		>
			{TYPES.map(({ value, labelEn, labelAr, emoji }) => {
				const active = activeType === value;
				return (
					<button
						key={value}
						onClick={() => onChange(value)}
						aria-pressed={active}
						className={`
              flex items-center gap-1.5 px-4 py-2 rounded-full border text-sm font-semibold
              transition-all duration-150
              ${active
								? "border-amber-400 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 shadow-sm"
								: "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-900"
							}
            `}
					>
						<span role="img" aria-hidden>{emoji}</span>
						{isAr ? labelAr : labelEn}
					</button>
				);
			})}
		</motion.div>
	);
}

export type { SearchFiltersProps };
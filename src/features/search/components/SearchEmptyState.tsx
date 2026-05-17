"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { Search, TrendingUp } from "lucide-react";
import { useLanguage } from "@/providers";
import { TEST_CATEGORIES } from "@/lib/data/categories/testData";

interface SearchEmptyStateProps {
	type: "no-results" | "start-search";
	searchTerm?: string;
	onCategoryClick?: (id: string) => void;
}

const fadeUp: Variants = {
	hidden: { opacity: 0, y: 12 },
	show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

export default function SearchEmptyState({
	type,
	searchTerm,
	onCategoryClick,
}: SearchEmptyStateProps) {
	const { language } = useLanguage();
	const isAr = language === "ar";
	const popular = TEST_CATEGORIES.slice(0, 6);

	// ── No results ─────────────────────────────────────────────────────────────
	if (type === "no-results") {
		return (
			<motion.div
				variants={fadeUp}
				initial="hidden"
				animate="show"
				className="flex flex-col items-center py-20 text-center"
			>
				<div className="text-5xl mb-4">🔍</div>
				<h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
					{isAr ? "لا توجد نتائج" : "No results found"}
				</h3>
				<p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm">
					{isAr
						? `لم نجد شيئاً لـ "${searchTerm}". جرّب كلمات مختلفة`
						: `Nothing matched "${searchTerm}". Try different keywords`}
				</p>

				{popular.length > 0 && (
					<div className="w-full max-w-lg">
						<p className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-3">
							{isAr ? "تصفح" : "Browse"}
						</p>
						<div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
							{popular.map((cat, i) => (
								<motion.button
									key={cat.id}
									initial={{ opacity: 0, scale: 0.9 }}
									animate={{ opacity: 1, scale: 1 }}
									transition={{ delay: i * 0.06 }}
									whileHover={{ scale: 1.04 }}
									whileTap={{ scale: 0.96 }}
									onClick={() => onCategoryClick?.(cat.id)}
									className="px-3 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-amber-300 dark:hover:border-amber-700 hover:bg-amber-50 dark:hover:bg-amber-900/10 transition-all"
								>
									{cat.name}
								</motion.button>
							))}
						</div>
					</div>
				)}
			</motion.div>
		);
	}

	// ── Start searching ────────────────────────────────────────────────────────
	return (
		<motion.div
			variants={fadeUp}
			initial="hidden"
			animate="show"
			className="flex flex-col items-center py-20 text-center"
		>
			<motion.div
				initial={{ scale: 0.7, rotate: -15, opacity: 0 }}
				animate={{ scale: 1, rotate: 0, opacity: 1 }}
				transition={{ type: "spring", stiffness: 200, damping: 18, delay: 0.1 }}
				className="w-24 h-24 rounded-3xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center mb-6 shadow-lg"
			>
				<Search className="w-10 h-10 text-amber-500" />
			</motion.div>

			<h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
				{isAr ? "ابدأ البحث" : "What are you craving?"}
			</h3>
			<p className="text-gray-500 dark:text-gray-400 mb-10 max-w-sm">
				{isAr
					? "اكتب اسم المنتج أو المتجر للبدء"
					: "Search for products, stores, or cuisine"}
			</p>

			{popular.length > 0 && (
				<div className="w-full max-w-lg">
					<div className="flex items-center justify-center gap-2 mb-4">
						<TrendingUp className="w-4 h-4 text-amber-500" />
						<span className="text-xs font-bold tracking-widest uppercase text-gray-400">
							{isAr ? "شائع" : "Trending"}
						</span>
					</div>
					<div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
						{popular.map((cat, i) => (
							<motion.button
								key={cat.id}
								initial={{ opacity: 0, scale: 0.9 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ delay: 0.3 + i * 0.07 }}
								whileHover={{ scale: 1.04, y: -2 }}
								whileTap={{ scale: 0.96 }}
								onClick={() => onCategoryClick?.(cat.id)}
								className="px-3 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-amber-300 dark:hover:border-amber-700 hover:bg-amber-50 dark:hover:bg-amber-900/10 hover:shadow-sm transition-all"
							>
								{cat.name}
							</motion.button>
						))}
					</div>
				</div>
			)}
		</motion.div>
	);
}
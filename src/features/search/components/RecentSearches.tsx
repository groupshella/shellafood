"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, X, Trash2 } from "lucide-react";
import { useLanguage } from "@/providers";
import {
	getSearchHistory,
	removeFromSearchHistory,
	clearSearchHistory,
	SearchHistoryItem,
} from "@/lib/utils/searchUtils";

interface RecentSearchesProps {
	onSearchClick: (term: string) => void;
	visible?: boolean;
}

export default function RecentSearches({
	onSearchClick,
	visible = true,
}: RecentSearchesProps) {
	const { language } = useLanguage();
	const isAr = language === "ar";
	const [history, setHistory] = useState<SearchHistoryItem[]>([]);

	useEffect(() => {
		const load = () => setHistory(getSearchHistory());
		load();
		window.addEventListener("searchHistoryUpdated", load);
		return () => window.removeEventListener("searchHistoryUpdated", load);
	}, []);

	const handleRemove = useCallback((e: React.MouseEvent, term: string) => {
		e.stopPropagation();
		removeFromSearchHistory(term);
		setHistory((prev) => prev.filter((i) => i.term !== term));
	}, []);

	const handleClearAll = useCallback(() => {
		clearSearchHistory();
		setHistory([]);
	}, []);

	if (!visible || !history.length) return null;

	return (
		<motion.section
			initial={{ opacity: 0, y: 6 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.35, delay: 0.2 }}
			className="mb-10 max-w-3xl mx-auto"
			aria-label={isAr ? "البحث الأخير" : "Recent searches"}
		>
			<div className={`flex items-center justify-between mb-3 ${isAr ? "flex-row-reverse" : ""}`}>
				<div className={`flex items-center gap-1.5 ${isAr ? "flex-row-reverse" : ""}`}>
					<Clock className="w-4 h-4 text-gray-400" />
					<span className="text-xs font-bold tracking-widest uppercase text-gray-400">
						{isAr ? "بحث سابق" : "Recent"}
					</span>
				</div>
				<button
					onClick={handleClearAll}
					className={`flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors ${isAr ? "flex-row-reverse" : ""}`}
				>
					<Trash2 className="w-3.5 h-3.5" />
					{isAr ? "مسح الكل" : "Clear all"}
				</button>
			</div>

			<div className={`flex flex-wrap gap-2 ${isAr ? "justify-end" : ""}`}>
				<AnimatePresence>
					{history.map((item, i) => (
						<motion.div
							key={item.term}
							initial={{ opacity: 0, scale: 0.85 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.85 }}
							transition={{ delay: i * 0.04 }}
							className="group relative flex items-center"
						>
							<button
								onClick={() => onSearchClick(item.term)}
								className="flex items-center gap-2 pl-3 pr-8 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-amber-50 dark:hover:bg-amber-900/20 hover:border-amber-300 dark:hover:border-amber-700 border border-transparent rounded-full text-sm text-gray-700 dark:text-gray-300 transition-all"
							>
								<Clock className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
								{item.term}
							</button>
							<button
								onClick={(e) => handleRemove(e, item.term)}
								className="absolute right-2 opacity-0 group-hover:opacity-100 p-0.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
								aria-label={isAr ? "حذف" : "Remove"}
							>
								<X className="w-3 h-3 text-gray-500" />
							</button>
						</motion.div>
					))}
				</AnimatePresence>
			</div>
		</motion.section>
	);
}
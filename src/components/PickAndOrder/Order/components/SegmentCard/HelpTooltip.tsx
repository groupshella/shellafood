"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle } from "lucide-react";

interface HelpTooltipProps {
	isOpen: boolean;
	onToggle: () => void;
	title: string;
	content: string;
	isArabic: boolean;
	tooltipRef: React.RefObject<HTMLDivElement>;
}

export const HelpTooltip: React.FC<HelpTooltipProps> = ({
	isOpen,
	onToggle,
	title,
	content,
	isArabic,
	tooltipRef,
}) => {
	return (
		<div className="relative" ref={tooltipRef}>
			<button
				onClick={(e) => {
					e.stopPropagation();
					onToggle();
				}}
				className="text-amber-500 dark:text-amber-400 hover:text-amber-600 dark:hover:text-amber-300 transition-colors p-0.5 sm:p-1 touch-manipulation"
				aria-label={isArabic ? "مساعدة" : "Help"}
			>
				<HelpCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
			</button>
			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ opacity: 0, scale: 0.95, y: -5 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.95, y: -5 }}
						className={`absolute ${isArabic ? "left-0 md:left-1/2 md:-translate-x-1/2" : "right-0 md:right-1/2 md:translate-x-1/2"} top-6 sm:top-7 z-[100] w-40 sm:w-48 md:w-64 lg:w-72 p-2 sm:p-2.5 md:p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg md:shadow-xl text-[10px] sm:text-xs md:text-sm text-gray-700 dark:text-gray-300 ${isArabic ? "text-right" : "text-left"}`}
						dir={isArabic ? "rtl" : "ltr"}
					>
						<p className="font-semibold mb-1 md:mb-2 text-gray-900 dark:text-gray-100 text-xs md:text-sm">
							{title}
						</p>
						<p className="leading-relaxed">{content}</p>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};


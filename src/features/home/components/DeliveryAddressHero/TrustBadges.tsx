"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star, Package, Store, Clock } from "lucide-react";
import { useLanguage } from "@/providers";

interface TrustBadgesProps {
	className?: string;
}

export default function TrustBadges({ className = "" }: TrustBadgesProps) {
	const { language } = useLanguage();
	const isArabic = language === "ar";

	const badges = [
		{
			icon: Package,
			value: "2M+",
			label: isArabic ? "طلبات موصّلة" : "Orders delivered",
			accent: "text-emerald-600 dark:text-emerald-400",
			bg: "bg-emerald-500/10 dark:bg-emerald-500/15",
		},
		{
			icon: Star,
			value: "4.8",
			label: isArabic ? "تقييم العملاء" : "Customer rating",
			accent: "text-amber-600 dark:text-amber-400",
			bg: "bg-amber-500/10 dark:bg-amber-500/15",
		},
		{
			icon: Store,
			value: "50K+",
			label: isArabic ? "مطاعم ومتاجر" : "Restaurants & stores",
			accent: "text-sky-600 dark:text-sky-400",
			bg: "bg-sky-500/10 dark:bg-sky-500/15",
		},
		{
			icon: Clock,
			value: "~20",
			suffix: isArabic ? "د" : "min",
			label: isArabic ? "متوسط التوصيل" : "Avg. delivery",
			accent: "text-violet-600 dark:text-violet-400",
			bg: "bg-violet-500/10 dark:bg-violet-500/15",
		},
	];

	return (
		<motion.ul
			initial={{ opacity: 0, y: 16 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5, delay: 0.35 }}
			className={`grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-2 xl:grid-cols-4 ${className}`}
		>
			{badges.map((badge, index) => {
				const Icon = badge.icon;
				return (
					<motion.li
						key={badge.label}
						initial={{ opacity: 0, y: 12 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.4 + index * 0.06 }}
						className="flex items-center gap-2.5 sm:gap-3 rounded-xl border border-gray-200/80 bg-white/70 px-3 py-2.5 shadow-sm backdrop-blur-sm dark:border-gray-700/60 dark:bg-gray-800/50 sm:rounded-2xl sm:px-4 sm:py-3"
					>
						<div
							className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg sm:h-10 sm:w-10 sm:rounded-xl ${badge.bg}`}
						>
							<Icon className={`h-4 w-4 sm:h-[18px] sm:w-[18px] ${badge.accent}`} strokeWidth={2.25} />
						</div>
						<div className="min-w-0">
							<p className="text-base font-bold leading-none text-gray-900 dark:text-gray-50 sm:text-lg">
								{badge.value}
								{badge.suffix && (
									<span className="ms-0.5 text-sm font-semibold text-gray-500 dark:text-gray-400">
										{badge.suffix}
									</span>
								)}
							</p>
							<p className="mt-0.5 truncate text-[11px] text-gray-500 dark:text-gray-400 sm:text-xs">
								{badge.label}
							</p>
						</div>
					</motion.li>
				);
			})}
		</motion.ul>
	);
}

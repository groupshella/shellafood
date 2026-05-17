"use client";

import React from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/providers";

export default function SearchHeader() {
	const { language } = useLanguage();
	const isAr = language === "ar";

	return (
		<motion.header
			initial={{ opacity: 0, y: -16 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
			className={`mb-10 ${isAr ? "text-right" : "text-center"}`}
		>
			<motion.div
				initial={{ scale: 0.8, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				transition={{ delay: 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
				className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 text-xs font-semibold tracking-widest uppercase mb-5"
			>
				<span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
				{isAr ? "اكتشف الأفضل" : "Discover the best"}
			</motion.div>

			<h1 className="font-black text-4xl sm:text-5xl lg:text-6xl text-gray-900 dark:text-white leading-[1.05] tracking-tight mb-3">
				{isAr ? (
					<>
						ابحث في{" "}
						<span className="text-amber-500">شلة فود</span>
					</>
				) : (
					<>
						Search{" "}
						<span className="relative inline-block">
							<span className="text-amber-500">Shella</span>
							<motion.span
								className="absolute -bottom-1 left-0 right-0 h-0.5 bg-amber-400 rounded-full"
								initial={{ scaleX: 0 }}
								animate={{ scaleX: 1 }}
								transition={{ delay: 0.6, duration: 0.4 }}
							/>
						</span>{" "}
						Food
					</>
				)}
			</h1>

			<p className="text-gray-500 dark:text-gray-400 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
				{isAr
					? "ابحث عن المتاجر والمطاعم والمنتجات التي تريدها"
					: "Find stores, restaurants, and products — all in one place"}
			</p>
		</motion.header>
	);
}
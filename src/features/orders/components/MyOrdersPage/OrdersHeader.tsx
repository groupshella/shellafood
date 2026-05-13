"use client";

import React from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/providers";

interface OrdersHeaderProps {
	/** Total running orders from API (all pages) */
	totalSize: number;
}

export function OrdersHeader({ totalSize }: OrdersHeaderProps) {
	const { language } = useLanguage();
	const isArabic = language === "ar";

	return (
		<div className="mx-auto max-w-7xl px-3 py-4 sm:px-4 sm:py-6 lg:px-8">
			<motion.div
				initial={{ opacity: 0, y: -12 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.35 }}
				className="relative overflow-hidden rounded-xl bg-gradient-to-r from-green-600 via-green-600 to-emerald-600 p-6 text-white shadow-lg dark:from-green-700 dark:to-emerald-700 sm:p-8"
			>
				<div className="pointer-events-none absolute end-0 top-0 h-48 w-48 -translate-y-1/2 translate-x-1/3 rounded-full bg-white/10" />
				<div className="pointer-events-none absolute bottom-0 start-0 h-40 w-40 translate-x-[-40%] translate-y-1/3 rounded-full bg-white/10" />

				<div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div className={isArabic ? "text-right" : "text-left"}>
						<h1 className="mb-1 text-2xl font-extrabold sm:text-3xl md:text-4xl">
							{isArabic ? "طلباتي" : "My orders"}
						</h1>
						<p className="text-sm opacity-90 sm:text-base">
							{isArabic
								? "الطلبات الجارية — متابعة حالتك"
								: "Running orders — track your status"}
						</p>
					</div>

					<div className="flex justify-center sm:justify-end">
						<div className="rounded-xl bg-white/20 px-6 py-3 text-center backdrop-blur-sm sm:px-8 sm:py-4">
							<div className="text-3xl font-bold sm:text-4xl">{totalSize}</div>
							<div className="text-xs opacity-90 sm:text-sm">
								{isArabic ? "طلبات جارية" : "Running orders"}
							</div>
						</div>
					</div>
				</div>
			</motion.div>
		</div>
	);
}

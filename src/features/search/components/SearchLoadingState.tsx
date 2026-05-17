"use client";

import React from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/providers";

function Skeleton({ className }: { className?: string }) {
	return (
		<div
			className={`animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800 ${className ?? ""}`}
		/>
	);
}

export default function SearchLoadingState() {
	const { language } = useLanguage();
	const isAr = language === "ar";

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.3 }}
			className="space-y-8"
			aria-label={isAr ? "جاري البحث..." : "Searching..."}
		>
			{/* Section label skeleton */}
			<div className="space-y-4">
				<Skeleton className="h-5 w-32" />
				<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
					{Array.from({ length: 10 }).map((_, i) => (
						<div key={i} className="rounded-2xl overflow-hidden">
							<Skeleton className="h-40 w-full rounded-2xl" />
							<div className="mt-2 space-y-1.5 px-1">
								<Skeleton className="h-3.5 w-3/4" />
								<Skeleton className="h-3 w-1/2" />
								<Skeleton className="h-4 w-1/3" />
							</div>
						</div>
					))}
				</div>
			</div>
		</motion.div>
	);
}
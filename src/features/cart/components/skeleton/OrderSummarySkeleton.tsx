"use client";

import { motion } from "framer-motion";

export function OrderSummarySkeleton() {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-5 sm:p-6"
		>
			<div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-32 mb-6" />
			<div className="space-y-3 mb-6">
				{[1, 2, 3].map((i) => (
					<div key={i} className="flex justify-between">
						<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-24" />
						<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-16" />
					</div>
				))}
			</div>
			<div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse w-full" />
		</motion.div>
	);
}


"use client";

import React from "react";
import { motion } from "framer-motion";

function SkeletonCard() {
	return (
		<div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
			{/* Cover */}
			<div className="h-36 bg-gray-200 dark:bg-gray-800 animate-pulse" />
			{/* Body */}
			<div className="px-4 pt-7 pb-4 space-y-2">
				<div className="flex items-center justify-between gap-2">
					<div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
					<div className="h-3 w-10  bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
				</div>
				<div className="h-3 w-1/2 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
				<div className="flex gap-1.5 mt-1">
					<div className="h-5 w-16 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse" />
					<div className="h-5 w-14 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse" />
				</div>
				<div className="flex justify-between mt-2">
					<div className="h-3 w-16 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
					<div className="h-3 w-12 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
				</div>
			</div>
		</div>
	);
}

export default function SearchLoadingState() {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
		>
			{Array.from({ length: 8 }).map((_, i) => (
				<SkeletonCard key={i} />
			))}
		</motion.div>
	);
}
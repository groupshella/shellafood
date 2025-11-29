"use client";

import React from "react";
import { motion } from "framer-motion";

interface OfferLoadingProps {
	isArabic: boolean;
}

export default function OfferLoading({ isArabic }: OfferLoadingProps) {
	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900">
			{/* Hero Skeleton */}
			<div className="relative h-[60vh] min-h-[500px] bg-gray-200 dark:bg-gray-800 animate-pulse">
				<div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent" />
				<div className="relative h-full flex flex-col justify-end max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
					<div className="space-y-6">
						{/* Badges */}
						<div className="flex gap-3">
							<div className="w-32 h-10 bg-gray-700/50 rounded-full" />
							<div className="w-24 h-10 bg-gray-700/50 rounded-full" />
						</div>
						{/* Title */}
						<div className="space-y-3">
							<div className="w-2/3 h-12 bg-gray-700/50 rounded-lg" />
							<div className="w-1/2 h-8 bg-gray-700/50 rounded-lg" />
						</div>
						{/* Cards */}
						<div className="flex gap-3">
							<div className="w-48 h-20 bg-gray-700/50 rounded-xl" />
							<div className="w-40 h-20 bg-gray-700/50 rounded-xl" />
						</div>
					</div>
				</div>
			</div>

			{/* Content Skeletons */}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
				{/* Driver Card Skeleton */}
				<div className="bg-white dark:bg-gray-800 rounded-3xl p-8 animate-pulse">
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
						<div className="flex flex-col items-center space-y-4">
							<div className="w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded-full" />
							<div className="w-32 h-6 bg-gray-200 dark:bg-gray-700 rounded" />
							<div className="w-24 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
						</div>
						<div className="space-y-3">
							<div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-xl" />
							<div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-xl" />
							<div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-xl" />
						</div>
						<div className="space-y-3">
							<div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-xl" />
							<div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-xl" />
							<div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl" />
						</div>
					</div>
				</div>

				{/* Benefits Skeleton */}
				<div className="bg-white dark:bg-gray-800 rounded-3xl p-8 animate-pulse">
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
						{[...Array(6)].map((_, i) => (
							<div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
						))}
					</div>
				</div>
			</div>

			{/* Loading Text */}
			<div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
				<motion.div
					animate={{ rotate: 360 }}
					transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
					className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full"
				/>
				<p className="text-center mt-4 text-gray-600 dark:text-gray-400 font-semibold">
					{isArabic ? "جاري التحميل..." : "Loading..."}
				</p>
			</div>
		</div>
	);
}


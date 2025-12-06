"use client";

import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { AlertCircle, Home, ArrowLeft } from "lucide-react";

interface OfferNotFoundProps {
	isArabic: boolean;
}

export default function OfferNotFound({ isArabic }: OfferNotFoundProps) {
	const router = useRouter();

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-850 dark:to-gray-800 px-4">
			<motion.div
				initial={{ opacity: 0, scale: 0.9 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.5 }}
				className="text-center max-w-lg"
			>
				{/* Error Icon */}
				<motion.div
					initial={{ scale: 0 }}
					animate={{ scale: 1 }}
					transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
					className="mb-8 inline-block"
				>
					<div className="relative">
						<div className="w-32 h-32 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center shadow-2xl">
							<AlertCircle className="w-16 h-16 text-white" />
						</div>
						{/* Animated Ring */}
						<motion.div
							animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
							transition={{ duration: 2, repeat: Infinity }}
							className="absolute inset-0 border-4 border-red-500 rounded-full"
						/>
					</div>
				</motion.div>

				{/* Title */}
				<motion.h1
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.3 }}
					className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white mb-4"
				>
					{isArabic ? "العرض غير موجود" : "Offer Not Found"}
				</motion.h1>

				{/* Description */}
				<motion.p
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.4 }}
					className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed"
				>
					{isArabic
						? "عذراً، هذا العرض غير متاح حالياً أو قد تكون صلاحيته قد انتهت."
						: "Sorry, this offer is not available or may have expired."}
				</motion.p>

				{/* Action Buttons */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.5 }}
					className="flex flex-col sm:flex-row gap-4 justify-center"
				>
					<button
						onClick={() => router.push("/")}
						className="flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-bold text-base shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 active:scale-95"
					>
						<Home className="w-5 h-5" />
						{isArabic ? "العودة للرئيسية" : "Back to Home"}
					</button>

					<button
						onClick={() => router.back()}
						className="flex items-center justify-center gap-3 px-8 py-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-600 rounded-xl font-bold text-base shadow-lg hover:shadow-xl transition-all"
					>
						<ArrowLeft className={`w-5 h-5 ${isArabic ? "rotate-180" : ""}`} />
						{isArabic ? "رجوع" : "Go Back"}
					</button>
				</motion.div>

				{/* Suggestion */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.6 }}
					className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl"
				>
					<p className="text-sm text-blue-800 dark:text-blue-300">
						💡 {isArabic ? "اكتشف عروضنا الأخرى المتاحة" : "Discover our other available offers"}
					</p>
				</motion.div>
			</motion.div>
		</div>
	);
}


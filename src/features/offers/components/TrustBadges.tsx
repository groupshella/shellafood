"use client";

import React from "react";
import { motion } from "framer-motion";
import { Shield, Award, Clock, Users, ThumbsUp, Star } from "lucide-react";

interface TrustBadgesProps {
	isArabic: boolean;
}

export default function TrustBadges({ isArabic }: TrustBadgesProps) {
	const badges = [
		{
			icon: <Users className="w-5 h-5" />,
			value: "50K+",
			label: isArabic ? "عميل راضٍ" : "Happy Customers",
			color: "text-blue-600 dark:text-blue-400",
			bg: "bg-blue-100 dark:bg-blue-900/30",
		},
		{
			icon: <Star className="w-5 h-5" />,
			value: "4.9",
			label: isArabic ? "تقييم ممتاز" : "Excellent Rating",
			color: "text-yellow-600 dark:text-yellow-400",
			bg: "bg-yellow-100 dark:bg-yellow-900/30",
		},
		{
			icon: <Shield className="w-5 h-5" />,
			value: "100%",
			label: isArabic ? "تأمين شامل" : "Fully Insured",
			color: "text-emerald-600 dark:text-emerald-400",
			bg: "bg-emerald-100 dark:bg-emerald-900/30",
		},
		{
			icon: <Clock className="w-5 h-5" />,
			value: "24/7",
			label: isArabic ? "دعم متواصل" : "Support Available",
			color: "text-purple-600 dark:text-purple-400",
			bg: "bg-purple-100 dark:bg-purple-900/30",
		},
		{
			icon: <ThumbsUp className="w-5 h-5" />,
			value: "98%",
			label: isArabic ? "رضا العملاء" : "Customer Satisfaction",
			color: "text-pink-600 dark:text-pink-400",
			bg: "bg-pink-100 dark:bg-pink-900/30",
		},
		{
			icon: <Award className="w-5 h-5" />,
			value: "#1",
			label: isArabic ? "الأفضل في السعودية" : "Best in Saudi Arabia",
			color: "text-orange-600 dark:text-orange-400",
			bg: "bg-orange-100 dark:bg-orange-900/30",
		},
	];

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5, delay: 0.3 }}
			className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-850 rounded-3xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 sm:p-8"
		>
			{/* Header */}
			<div className="text-center mb-8">
				<h3 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mb-2">
					{isArabic ? "لماذا يثق بنا الآلاف" : "Why Thousands Trust Us"}
				</h3>
				<p className="text-gray-600 dark:text-gray-400">
					{isArabic ? "أرقام تتحدث عن نفسها" : "Numbers speak for themselves"}
				</p>
			</div>

			{/* Badges Grid */}
			<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
				{badges.map((badge, index) => (
					<motion.div
						key={index}
						initial={{ opacity: 0, scale: 0.8 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ delay: 0.1 * index, duration: 0.4 }}
						whileHover={{ scale: 1.05, y: -4 }}
						className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300"
					>
						{/* Icon */}
						<div className={`${badge.bg} ${badge.color} p-3 rounded-xl mb-3`}>
							{badge.icon}
						</div>

						{/* Value */}
						<div className="text-2xl font-black text-gray-900 dark:text-white mb-1">
							{badge.value}
						</div>

						{/* Label */}
						<div className="text-xs text-gray-600 dark:text-gray-400 text-center font-medium leading-tight">
							{badge.label}
						</div>
					</motion.div>
				))}
			</div>
		</motion.div>
	);
}


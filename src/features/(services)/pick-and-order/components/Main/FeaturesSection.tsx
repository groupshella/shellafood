"use client";

import React from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/providers";
import { Clock, Shield, Headphones } from "lucide-react";
import { FEATURES_DATA } from "@/features/(services)/pick-and-order/constants/pick-and-order.constants";

/**
 * Features Section - Clean & Modern Design
 * Simple feature cards matching the app's design system
 */
export const FeaturesSection: React.FC = () => {
	const { language } = useLanguage();
	const isArabic = language === "ar";

	const title = isArabic ? "مميزات خدماتنا" : "Our Service Features";
	const subtitle = isArabic
		? "نقدم لك أفضل الخدمات لتجربة توصيل استثنائية"
		: "We provide the best services for an exceptional delivery experience";

	// Map icon names to icon components
	const iconMap = {
		Clock,
		Shield,
		Headphones,
	} as const;

	// Transform features data with icons and localized text
	const features = FEATURES_DATA.map((feature) => ({
		icon: iconMap[feature.iconName],
		title: isArabic ? feature.title.ar : feature.title.en,
		description: isArabic ? feature.description.ar : feature.description.en,
	}));

	return (
		<section className="bg-gray-50 dark:bg-gray-900 py-12 sm:py-16 lg:py-20">
			<div className="w-full px-4 sm:px-6 lg:px-12 xl:px-16 2xl:px-24">
				{/* Section Header */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.4 }}
					className="text-center mb-8 sm:mb-12"
				>
					<h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-3">
						{title}
					</h2>
					<p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
						{subtitle}
					</p>
				</motion.div>

				{/* Features Grid */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
					{features.map((feature, index) => {
						const Icon = feature.icon;
						return (
							<motion.div
								key={index}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.4, delay: index * 0.1 }}
								className="flex flex-col items-center text-center p-6 rounded-xl bg-white dark:bg-gray-800 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors duration-200 shadow-sm"
							>
								{/* Icon */}
								<div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-4 sm:mb-6">
									<div className="text-green-600 dark:text-green-400">
										<Icon className="h-8 w-8 sm:h-10 sm:w-10" aria-hidden="true" />
									</div>
								</div>

								{/* Title */}
								<h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2 sm:mb-3">
									{feature.title}
								</h3>

								{/* Description */}
								<p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
									{feature.description}
								</p>
							</motion.div>
						);
					})}
				</div>
			</div>
		</section>
	);
};


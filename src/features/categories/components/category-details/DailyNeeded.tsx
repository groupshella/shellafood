"use client";

import { useLanguage } from "@/providers";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { DAILY_NEEDED_ITEMS } from "../../constants/categories.constants";
import type { DailyNeededItem } from "../../types/category.types";

export default function DailyNeeded() {
	const { language } = useLanguage();
	const isArabic = language === "ar";
	const router = useRouter();

	const handleItemClick = () => {
		router.push("/categories/supermarket/hyper-shella");
	};

	const title = isArabic ? "احتياجات يومية" : "Daily Needed";
	const description = isArabic 
		? "تسوق من هايبر شلة واحصل على كل ما تحتاجه"
		: "Shop from Hyper Shella and get everything you need";

	return (
		<div className="mb-8 sm:mb-12">
			{/* Header */}
			<div className="mb-4 sm:mb-6">
				<h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-gray-900 dark:text-white mb-2">
					{title}
				</h2>
				<p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
					{description}
				</p>
			</div>

			{/* Items Grid - 3 columns */}
			<div className="grid grid-cols-3 gap-2 sm:gap-3">
				{DAILY_NEEDED_ITEMS.map((item: DailyNeededItem, index: number) => {
					const displayName = isArabic ? item.nameAr : item.name;
					return (
						<motion.div
							key={item.id}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.3, delay: index * 0.05 }}
							whileHover={{ y: -4 }}
							onClick={handleItemClick}
							className="group cursor-pointer bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all duration-300"
						>
							{/* Image - Smaller */}
							<div className="relative h-20 sm:h-24 overflow-hidden bg-gray-100 dark:bg-gray-700">
								<Image
									src={item.image}
									alt={displayName}
									fill
									className="object-cover group-hover:scale-110 transition-transform duration-500"
									unoptimized
								/>
								{/* Emoji Overlay - Smaller */}
								<div className="absolute top-1 right-1 sm:top-2 sm:right-2 text-lg sm:text-xl bg-white/90 dark:bg-gray-800/90 rounded-full w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center shadow-md">
									{item.emoji}
								</div>
							</div>

							{/* Content - Smaller */}
							<div className="p-2 sm:p-2.5">
								<h3 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white text-center group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors line-clamp-2">
									{displayName}
								</h3>
							</div>
						</motion.div>
					);
				})}
			</div>
		</div>
	);
}


"use client";

import React, { useCallback, useEffect, useTransition } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/providers";
import { Loader2, Sparkles } from "lucide-react";
import { CategoriesGridSkeleton, CategoriesSlider } from "@/features/categories";
import { Category } from "@/shared/components";
import { useRouter } from "next/navigation";
import { FaStore } from "react-icons/fa";
import { ZoneDataModule } from "@/features/categories/types/module.types";
import { useModules } from "@/features/categories/hooks/useModules";

export default function CategoriesSection({modules}: {modules: ZoneDataModule[]}) {
	const { language } = useLanguage();
	const isArabic = language === "ar";
	const router = useRouter();  
	const [isPending, startTransition] = useTransition();
	
	const handleClickViewAll = () => {
		console.log('view all');
		startTransition(() => {
				router.push(
					`/categories`,
					{ scroll: false }
				);
		});}

if (!modules || modules.length === 0 ) {
	return (
		<div className="flex items-center justify-center py-10">
			<div className="rounded-2xl border border-dashed border-gray-200 bg-white p-6 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
				<div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-300">
					<Sparkles className="h-5 w-5" />
				</div>
				<p className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
					{isArabic ? "لا توجد أقسام متاحة الآن" : "No categories available"}
				</p>
				<p className="text-sm text-gray-500 dark:text-gray-400">
					{isArabic
						? "سنضيف أقساماً جديدة قريباً، الرجاء التحقق لاحقاً"
						: "We’ll add new categories soon. Please check back later."}
				</p>
			</div>
		</div>
	);
}
	return (
		<motion.section
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4, delay: 0.2 }}
			className="mb-8 sm:mb-12"
		>
				{/* Header with Filters */}
				<div className="mb-6">
				<div className="flex items-center justify-between mb-4">
					<div className="flex items-center gap-2 mt-2">
						<div className="flex h-10 w-10 items-center justify-center rounded-xl  bg-green-600 shadow-lg">
							<FaStore className="h-5 w-5 text-white" />
						</div>
						<h2 className={`text-xl font-bold text-gray-900 dark:text-white sm:text-2xl ${isArabic ? "text-right" : "text-left"}`}>
							{isArabic ? "أقسامنا" : "Our Categories"}
						</h2>
					</div>
					<button
						onClick={handleClickViewAll}
						className="text-sm cursor-pointer font-medium text-green-600 transition-colors hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
					>
						{isArabic ? "عرض الكل" : "View All"} →
					</button>
				</div>

			</div>

			{/* Categories Slider Container */}
			<div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-200/50 dark:bg-gray-800 dark:ring-gray-700/50 sm:p-6">
				<CategoriesSlider modules={modules} />
			</div>
		</motion.section>
	);
}


"use client";

import { useLanguage } from "@/providers";
import { memo } from "react";
import { ZoneDataModule } from "../../types/module.types";
import CategoriesGrid from "./CategoriesGrid";
import { EmptyState } from "../shared";
import { CategoriesHero, TopSupermarketSection, ServicesSection } from "../..";

interface CategoriesPageProps {
	initialModules: ZoneDataModule[];
}


function CategoriesPage({
	initialModules,
}: CategoriesPageProps) {

	const { language } = useLanguage();
	const isArabic = language === 'ar';
	const direction = isArabic ? 'rtl' : 'ltr';




	// Early return if no modules
	if (!initialModules || initialModules.length === 0) {
		return (
			<div className="min-h-screen bg-gray-50 dark:bg-gray-900" dir={direction}>
				<div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
					<EmptyState
						icon="📦"
						title={isArabic ? "لا توجد أقسام متاحة" : "No categories available"}
						description={
							isArabic
								? "يرجى التحقق مرة أخرى لاحقاً"
								: "Please check back later"
						}
					/>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900" dir={direction}>
			{/* <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8"> */}
			{/* Hero Section */}
			{/* <div className="pt-8 pb-6">
				<CategoriesHero />
			</div> */}
			{/* Top Supermarket Section */}
			{/* <TopSupermarketSection /> */}

			{/* Services Section */}
			{/* <ServicesSection /> */}

			{/* Categories Grid Section */}
			<section className="py-6 sm:py-8 md:py-12" dir={direction}>
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="mb-6 sm:mb-8 text-right rtl:text-right ltr:text-left">
						<h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">
							{isArabic ? "جميع الأقسام" : "All Categories"}
						</h2>
						<p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-400">
							{isArabic
								? "تصفح جميع الأقسام المتاحة واختر ما يناسبك"
								: "Browse all available categories and choose what suits you"}
						</p>
					</div>

					<CategoriesGrid modules={initialModules} />
				</div>
			</section>
			{/* </div> */}
		</div>
	);
}

const CategoriesPageComponent = memo(CategoriesPage);
export default CategoriesPageComponent;

// Export CategoriesPage as named export for easier importing
export { CategoriesPageComponent as CategoriesPage };

// Export other components from this directory
export { default as CategoriesHero } from './CategoriesHero';
export { default as StatsBar } from './StatsBar';
export { default as CategoriesGrid } from './CategoriesGrid';
export { default as CategoriesGridSkeleton } from './CategoriesSkeleton';
export { default as ServicesSection } from './ServicesSection';
export { default as TopSupermarketSection } from './TopSupermarketSection';
export { default as CategoriesSlider } from './CategoriesSlider';


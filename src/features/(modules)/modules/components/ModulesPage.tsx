"use client";
import { useLanguage } from "@/providers";
import { Module } from "../types/module.types";
import EmptyState from "./EmptyState";
import ModuleCard from "./ModuleCard";
function ModulesPage({ modules }: { modules: Module[] }) {
	const { language } = useLanguage();
	const isArabic = language === 'ar';
	const direction = isArabic ? 'rtl' : 'ltr';
	if (!modules || modules.length === 0) {
		return (
			<div className="min-h-screen bg-gray-50 dark:bg-gray-900" dir={direction}>
				<div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
					<EmptyState
						icon="📦"
						title={isArabic ? "لا توجد أقسام متاحة" : "No Modules available"}
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

			<section className="py-6 sm:py-8 md:py-12" dir={direction}>
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="mb-6 sm:mb-8 text-right rtl:text-right ltr:text-left">
						<h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">
							{isArabic ? "جميع الأقسام" : "All Modules"}
						</h2>
						<p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-400">
							{isArabic
								? "تصفح جميع الأقسام المتاحة واختر ما يناسبك"
								: "Browse all available Modules and choose what suits you"}
						</p>
					</div>

					<div
						dir={direction}

						className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6"
					>
						{modules.map((module, index) => (
							<ModuleCard
								key={index}
								module={module}
							/>
						))}
					</div>
				</div>
			</section>
		</div>
	);
}

export default ModulesPage;

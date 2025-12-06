"use client";

import { memo } from "react";
import { useLanguage } from "@/providers";

interface Category {
	id: string;
	name: string;
	nameAr?: string;
	description?: string;
	descriptionAr?: string;
	image?: string;
	path?: string;
}

interface CategoriesSliderGridProps {
	categories: Category[];
	onCategoryClick?: (categoryPath: string, categoryName: string) => void;
	className?: string;
	id?: string;
}

function CategoriesSliderGrid({ categories, onCategoryClick, className = "", id }: CategoriesSliderGridProps) {
	const { language } = useLanguage();
	const isArabic = language === "ar";
	
	// Default style for all categories
	const defaultStyle = {
		icon: "📂",
		color: "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700",
		textColor: "text-gray-700 dark:text-gray-300",
	};

	return (
		<div
			id={id || "categories-scroll-container"}
			className={`scrollbar-hide flex gap-6 space-x-reverse overflow-x-auto px-4 pb-2 ${className}`}
		>
			{categories.map((category) => {
				const displayName = isArabic && category.nameAr ? category.nameAr : category.name;
				const categoryPath = category.path || `/categories/${category.id}`;
				
				return (
					<button
						key={category.id}
						onClick={() => onCategoryClick?.(categoryPath, displayName)}
						className="flex w-[100px] flex-shrink-0 transform cursor-pointer flex-col items-center text-center transition-all duration-300 hover:scale-105"
					>
						<div className="relative h-[90px] w-[90px] overflow-hidden rounded-full">
							{category.image ? (
								<img
									src={category.image}
									alt={displayName}
									className="absolute inset-0 h-full w-full object-cover"
									onError={(e) => {
										const target = e.target as HTMLImageElement;
										target.style.display = "none";
										const parent = target.parentElement;
										if (parent) {
											parent.innerHTML = `<div class="w-full h-full flex items-center justify-center rounded-full ${defaultStyle.color}"><span class="text-3xl">${defaultStyle.icon}</span></div>`;
										}
									}}
								/>
							) : (
								<div
									className={`flex h-full w-full items-center justify-center rounded-full ${defaultStyle.color}`}
								>
									<span className="text-3xl">{defaultStyle.icon}</span>
								</div>
							)}
						</div>
						<p
							className={`mt-2 text-xs font-medium ${defaultStyle.textColor} line-clamp-2`}
						>
							{displayName}
						</p>
					</button>
				);
			})}
		</div>
	);
}

export default memo(CategoriesSliderGrid);

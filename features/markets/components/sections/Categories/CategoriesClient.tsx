"use client";

import Link from "next/link";
import { Category } from "@/features/markets/types/categories.types";
import { ScrollContainer } from "@/features/home/components/shared/ScrollContainer";
import { CategoryCard } from "./CategoryCard";

interface CategoriesClientProps {
	categories: Category[];
	moduleId: string;
	moduleName?: string;
	isArabic: boolean;
}

function buildAllCategoriesHref(moduleId: string, moduleName?: string) {
	const params = new URLSearchParams();
	if (moduleName) params.set("module_name", moduleName);
	const query = params.toString();
	return `/modules/${moduleId}/categories${query ? `?${query}` : ""}`;
}

const VIEW_MORE_BTN = [
	"inline-flex min-h-[36px] shrink-0 items-center rounded-lg px-3 py-1.5",
	"bg-card text-xs font-medium text-foreground",
	"transition-colors hover:brightness-95 active:brightness-90",
	"sm:px-3.5 sm:py-2 sm:text-sm",
	"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background",
].join(" ");

export function CategoriesClient({
	categories,
	moduleId,
	moduleName,
	isArabic,
}: CategoriesClientProps) {
	const allCategoriesHref = buildAllCategoriesHref(moduleId, moduleName);

	return (
		<section
			aria-label={isArabic ? "الأقسام" : "Categories"}
			className="w-full space-y-3 py-4 sm:space-y-4 sm:py-5"
			dir={isArabic ? "rtl" : "ltr"}
			lang={isArabic ? "ar" : "en"}
		>
			<div className="mx-auto flex w-full max-w-lg items-center justify-between gap-3 px-3 sm:max-w-2xl sm:px-5 md:max-w-3xl lg:max-w-4xl lg:px-6 xl:max-w-5xl 2xl:max-w-6xl">
				<h2 className="text-base font-bold text-foreground sm:text-lg md:text-xl">
					{isArabic ? "الأقسام" : "Categories"}
				</h2>

				<Link href={allCategoriesHref} className={VIEW_MORE_BTN}>
					{isArabic ? "تطلع على المزيد" : "See more"}
				</Link>
			</div>

			<ScrollContainer className="px-3 sm:px-5 lg:px-6 [&>div]:mx-auto [&>div]:max-w-lg sm:[&>div]:max-w-2xl md:[&>div]:max-w-3xl lg:[&>div]:max-w-4xl xl:[&>div]:max-w-5xl 2xl:[&>div]:max-w-6xl">
				{categories.map((category) => (
					<div key={category.id} className="snap-start">
						<CategoryCard category={category} moduleId={moduleId} mode="filter" />
					</div>
				))}
			</ScrollContainer>
		</section>
	);
}

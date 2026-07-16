"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Category } from "@/features/markets/types/categories.types";
import { CategoryCard } from "../Categories/CategoryCard";

const ICON_BTN = [
	"flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-foreground sm:h-11 sm:w-11",
	"transition-colors hover:bg-card active:scale-95",
	"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background",
].join(" ");

interface AllCategoriesClientProps {
	categories: Category[];
	moduleId: string;
	moduleName?: string;
	isArabic: boolean;
}

function buildBackHref(moduleId: string, moduleName?: string) {
	const params = new URLSearchParams();
	if (moduleName) params.set("module_name", moduleName);
	const query = params.toString();
	return `/modules/${moduleId}${query ? `?${query}` : ""}`;
}

export function AllCategoriesClient({
	categories,
	moduleId,
	moduleName,
	isArabic,
}: AllCategoriesClientProps) {
	if (categories.length === 0) return null;

	const backHref = buildBackHref(moduleId, moduleName);

	return (
		<div
			className="min-h-dvh"
			dir={isArabic ? "rtl" : "ltr"}
			lang={isArabic ? "ar" : "en"}
		>
			<header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur-md">
				<div className="relative mx-auto flex min-h-[3.25rem] w-full max-w-lg items-center justify-center px-3 py-2.5 sm:max-w-2xl sm:px-5 md:max-w-3xl lg:max-w-4xl lg:px-6 xl:max-w-5xl 2xl:max-w-6xl">
					<Link
						href={backHref}
						className={`${ICON_BTN} absolute start-3 sm:start-5 lg:start-6`}
						aria-label={isArabic ? "العودة" : "Go back"}
					>
						<ChevronRight
							className={[
								"h-5 w-5 text-brand",
								isArabic ? "" : "rotate-180",
							].join(" ")}
							strokeWidth={2}
							aria-hidden
						/>
					</Link>

					<h1 className="text-base font-semibold text-muted sm:text-lg md:text-xl">
						{isArabic ? "الأقسام" : "Categories"}
					</h1>
				</div>
			</header>

			<section
				aria-label={isArabic ? "جميع الأقسام" : "All categories"}
				className="mx-auto w-full max-w-lg px-3 pb-8 pt-5 sm:max-w-2xl sm:px-5 md:max-w-3xl lg:max-w-4xl lg:px-6 xl:max-w-5xl 2xl:max-w-6xl"
			>
				<div className="grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-3 sm:gap-x-4 sm:gap-y-6 md:grid-cols-4 lg:grid-cols-5 lg:gap-x-5 lg:gap-y-8 xl:grid-cols-6">
					{categories.map((category) => (
						<CategoryCard
							key={category.id}
							category={category}
							moduleId={moduleId}
							mode="filter"
							layout="grid"
						/>
					))}
				</div>
			</section>
		</div>
	);
}

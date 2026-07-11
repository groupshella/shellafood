"use client";

import Link from "next/link";
import { Category } from "@/features/markets/types/categories.types";
import { ScrollContainer } from "@/features/home/components/shared/ScrollContainer";
import { CategoryCard } from "./CategoryCard";

interface CategoriesClientProps {
    categories: Category[];
    moduleId: string;
    moduleName?: string;
}

function buildAllCategoriesHref(moduleId: string, moduleName?: string) {
    const params = new URLSearchParams();
    if (moduleName) params.set("module_name", moduleName);
    const query = params.toString();
    return `/modules/${moduleId}/categories${query ? `?${query}` : ""}`;
}

const VIEW_MORE_BTN = [
    "inline-flex min-h-[36px] shrink-0 items-center rounded-lg px-3 py-1.5",
    "bg-[#F0F0F0] text-xs font-medium text-gray-800",
    "dark:bg-gray-800 dark:text-gray-200",
    "transition-colors active:bg-[#E4E4E4] dark:active:bg-gray-700",
    "sm:px-3.5 sm:py-2 sm:text-sm",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900",
].join(" ");

export function CategoriesClient({ categories, moduleId, moduleName }: CategoriesClientProps) {
    const allCategoriesHref = buildAllCategoriesHref(moduleId, moduleName);

    return (
        <section
            aria-label="الأقسام"
            className="w-full space-y-3 py-4 sm:space-y-4 sm:py-5"
            dir="rtl"
        >
            <div className="mx-auto flex w-full max-w-lg items-center justify-between gap-3 px-3 sm:max-w-2xl sm:px-5 lg:max-w-4xl lg:px-6 xl:max-w-5xl 2xl:max-w-6xl">
                <h2 className="text-base font-semibold text-gray-500 dark:text-gray-400 sm:text-lg">الأقسام</h2>

                <Link href={allCategoriesHref} className={VIEW_MORE_BTN}>
                    تطلع على المزيد
                </Link>
            </div>

            <ScrollContainer className="px-3 sm:px-5 lg:px-6 [&>div]:mx-auto [&>div]:max-w-lg sm:[&>div]:max-w-2xl lg:[&>div]:max-w-4xl xl:[&>div]:max-w-5xl 2xl:[&>div]:max-w-6xl">
                {categories.map((category) => (
                    <div key={category.id} className="snap-start">
                        <CategoryCard
                            category={category}
                            moduleId={moduleId}
                            mode="filter"
                        />
                    </div>
                ))}
            </ScrollContainer>
        </section>
    );
}

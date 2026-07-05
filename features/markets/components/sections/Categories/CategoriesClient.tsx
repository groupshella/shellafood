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

export function CategoriesClient({ categories, moduleId, moduleName }: CategoriesClientProps) {
    const allCategoriesHref = buildAllCategoriesHref(moduleId, moduleName);

    return (
        <section aria-label="الأقسام" className="w-full space-y-4 bg-white py-4" dir="rtl">
            <div className="flex items-center justify-between gap-3 px-4 sm:px-6">
                <h2 className="text-base font-semibold text-gray-500 sm:text-lg">الأقسام</h2>

                <Link
                    href={allCategoriesHref}
                    className={[
                        "inline-flex shrink-0 items-center rounded-lg bg-[#F0F0F0] px-3 py-1.5",
                        "text-xs font-medium text-gray-800 sm:px-3.5 sm:py-2 sm:text-sm",
                        "transition-colors active:bg-[#E4E4E4]",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2 focus-visible:ring-offset-black",
                    ].join(" ")}
                >
                    تطلع على المزيد
                </Link>
            </div>

            <ScrollContainer className="px-4 sm:px-6">
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

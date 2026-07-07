"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Category } from "@/features/markets/types/categories.types";
import { CategoryCard } from "../Categories/CategoryCard";

const ICON_BTN = [
    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-gray-700 sm:h-11 sm:w-11",
    "transition-colors hover:bg-gray-50 active:scale-95",
    "dark:text-gray-300 dark:hover:bg-gray-800",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-950",
].join(" ");

interface AllCategoriesClientProps {
    categories: Category[];
    moduleId: string;
    moduleName?: string;
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
}: AllCategoriesClientProps) {
    if (categories.length === 0) return null;

    const backHref = buildBackHref(moduleId, moduleName);

    return (
        <div className="min-h-dvh bg-white dark:bg-gray-950" dir="rtl">
            <header className="sticky top-0 z-20 border-b border-black/[0.04] bg-white/95 backdrop-blur-md dark:border-white/[0.06] dark:bg-gray-900/95">
                <div className="relative mx-auto flex min-h-[3.25rem] w-full max-w-lg items-center justify-center px-3 py-2.5 sm:max-w-2xl sm:px-5 lg:max-w-4xl lg:px-6 xl:max-w-5xl 2xl:max-w-6xl">
                    <Link
                        href={backHref}
                        className={`${ICON_BTN} absolute right-3 sm:right-5 lg:right-6`}
                        aria-label="العودة"
                    >
                        <ChevronRight className="h-5 w-5 text-[#30913F] dark:text-[#4db860]" strokeWidth={2} />
                    </Link>

                    <h1 className="text-base font-semibold text-gray-500 dark:text-gray-400 sm:text-lg md:text-xl">الأقسام</h1>
                </div>
            </header>

            <section aria-label="جميع الأقسام" className="mx-auto w-full max-w-lg px-3 pb-8 pt-5 sm:max-w-2xl sm:px-5 lg:max-w-4xl lg:px-6 xl:max-w-5xl 2xl:max-w-6xl">
                <div className="grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-3 sm:gap-x-4 sm:gap-y-6 md:grid-cols-4 lg:grid-cols-5 lg:gap-x-5 lg:gap-y-8 xl:grid-cols-6">
                    {categories.map((category) => (
                        <CategoryCard
                            key={category.id}
                            category={category}
                            moduleId={moduleId}
                            layout="grid"
                        />
                    ))}
                </div>
            </section>
        </div>
    );
}

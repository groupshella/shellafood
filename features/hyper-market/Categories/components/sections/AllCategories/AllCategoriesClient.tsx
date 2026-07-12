"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { StoreCategory } from "@/features/hyper-market/Categories/types/categories.types";
import { CategoryGridCard } from "./CategoryGridCard";

const ICON_BTN = [
    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-gray-700",
    "transition-colors hover:bg-gray-50 active:scale-95",
    "dark:text-gray-300 dark:hover:bg-gray-800",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-950",
].join(" ");

interface AllCategoriesClientProps {
    categories: StoreCategory[];
    isArabic: boolean;
}

export function AllCategoriesClient({ categories, isArabic }: AllCategoriesClientProps) {
    if (categories.length === 0) return null;

    return (
        <div dir={isArabic ? "rtl" : "ltr"} className="min-h-dvh">
            <header className="sticky top-0 z-20 border-b border-black/[0.04] bg-white/95 backdrop-blur-md dark:border-white/[0.06] dark:bg-gray-900/95">
                <div className="relative flex min-h-[3.25rem] items-center justify-center px-3 py-2.5 sm:px-5">
                    <Link
                        href="/hyper-market"
                        className={`${ICON_BTN} absolute start-3 sm:start-5`}
                        aria-label={isArabic ? "العودة إلى هايبر ماركت" : "Return to Hyper Market"}
                    >
                        <ChevronRight className="h-5 w-5 text-[#30913F] dark:text-[#4db860]" strokeWidth={2} aria-hidden />
                    </Link>

                    <h1 className="text-base font-bold text-gray-900 dark:text-gray-50 sm:text-lg md:text-xl">{isArabic ? "الأقسام" : "Categories"}</h1>
                </div>
            </header>

            <section aria-label={isArabic ? "جميع الأقسام" : "All categories"} className="px-3 pb-6 pt-4 sm:px-4 lg:px-6">
                <div className="grid grid-cols-3 gap-2 sm:gap-2.5 md:grid-cols-4 lg:grid-cols-5 lg:gap-3 xl:grid-cols-6">
                    {categories.map((category) => (
                        <CategoryGridCard key={category.id} category={category} isArabic={isArabic} />
                    ))}
                </div>
            </section>
        </div>
    );
}

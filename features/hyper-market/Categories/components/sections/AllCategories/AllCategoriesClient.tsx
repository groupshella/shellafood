"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { StoreCategory } from "@/features/hyper-market/Categories/types/categories.types";
import { CategoryGridCard } from "./CategoryGridCard";

const ICON_BTN = [
    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-foreground",
    "transition-colors hover:bg-card active:scale-95",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background",
].join(" ");

interface AllCategoriesClientProps {
    categories: StoreCategory[];
    isArabic: boolean;
}

export function AllCategoriesClient({
    categories,
    isArabic,
}: AllCategoriesClientProps) {
    if (categories.length === 0) return null;

    const BackIcon = isArabic ? ChevronRight : ChevronLeft;

    return (
        <div
            className="min-h-dvh"
            dir={isArabic ? "rtl" : "ltr"}
            lang={isArabic ? "ar" : "en"}
        >
            <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur-md">
                <div className="relative flex min-h-[3.25rem] items-center justify-center px-3 py-2.5 sm:px-5 md:px-6">
                    <Link
                        href="/hyper-market"
                        className={`${ICON_BTN} absolute start-3 sm:start-5`}
                        aria-label={
                            isArabic ? "العودة إلى هايبر ماركت" : "Back to hypermarket"
                        }
                    >
                        <BackIcon className="h-5 w-5 text-brand" strokeWidth={2} aria-hidden />
                    </Link>

                    <h1 className="text-base font-bold text-foreground sm:text-lg md:text-xl">
                        {isArabic ? "الأقسام" : "Categories"}
                    </h1>
                </div>
            </header>

            <section
                aria-label={isArabic ? "جميع الأقسام" : "All categories"}
                className="px-3 pb-6 pt-4 sm:px-4 md:px-5 lg:px-6"
            >
                <div className="grid grid-cols-3 gap-2 sm:gap-2.5 md:grid-cols-4 lg:grid-cols-5 lg:gap-3 xl:grid-cols-6">
                    {categories.map((category) => (
                        <CategoryGridCard key={category.id} category={category} />
                    ))}
                </div>
            </section>
        </div>
    );
}

"use client";

import { useRef } from "react";
import Link from "next/link";
import { StoreCategory } from "@/features/hyper-market/Categories/types/categories.types";
import { CategoryCard } from "./CategoryCard";

function buildColumns(categories: StoreCategory[]): StoreCategory[][] {
    const columns: StoreCategory[][] = [];
    for (let i = 0; i < categories.length; i += 2) {
        columns.push(categories.slice(i, i + 2));
    }
    return columns;
}

const COLUMN_CLASS = [
    "w-[calc((100%-1.25rem)/3)] min-w-[5.75rem] max-w-[7rem] shrink-0 snap-start",
    "sm:min-w-[6.75rem] sm:max-w-[7.5rem]",
    "md:max-w-[8.5rem]",
    "lg:max-w-[9.5rem]",
    "xl:max-w-[10.5rem]",
].join(" ");

const H_SCROLL = [
    "flex gap-2.5 overflow-x-auto pb-1 sm:gap-3 md:gap-3.5 lg:gap-4",
    "snap-x snap-mandatory scroll-smooth",
    "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
    "-mx-0.5 px-0.5",
].join(" ");

const VIEW_MORE_BTN = [
    "inline-flex min-h-[36px] shrink-0 items-center rounded-lg px-3 py-1.5",
    "bg-card text-xs font-medium text-foreground",
    "transition-colors hover:brightness-95 active:brightness-90",
    "sm:min-h-[40px] sm:px-3.5 sm:py-2 sm:text-sm",
    "md:min-h-[44px] md:px-4 md:text-[15px]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background",
].join(" ");

interface CategoriesGridClientProps {
    categories: StoreCategory[];
    isArabic: boolean;
}

export function CategoriesGridClient({
    categories,
    isArabic,
}: CategoriesGridClientProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    const columns = buildColumns(categories);
    const hasMultipleColumns = columns.length > 3;

    if (categories.length === 0) return null;

    return (
        <section
            aria-label={isArabic ? "تصنيفات المتجر" : "Store categories"}
            className="w-full bg-transparent px-3 pb-5 pt-3 sm:px-5 md:px-6 lg:px-6"
            dir={isArabic ? "rtl" : "ltr"}
            lang={isArabic ? "ar" : "en"}
        >
            <div className="mb-3 flex items-center justify-between gap-3 sm:mb-3.5 md:mb-4">
                <h2 className="min-w-0 truncate text-base font-bold text-foreground sm:text-lg md:text-xl">
                    {isArabic ? "الاقسام" : "Categories"}
                </h2>

                <Link href={"/hyper-market/categories"} className={VIEW_MORE_BTN}>
                    {isArabic ? "تطلع على المزيد" : "See more"}
                </Link>
            </div>

            <div className="relative">
                {hasMultipleColumns && (
                    <div
                        className="pointer-events-none absolute inset-y-0 start-0 z-10 w-10 bg-gradient-to-r from-background via-background/80 to-transparent rtl:bg-gradient-to-l sm:w-12 md:w-14"
                        aria-hidden
                    />
                )}

                <div ref={scrollRef} className={H_SCROLL}>
                    {columns.map((column) => (
                        <div
                            key={column.map((c) => c.id).join("-")}
                            className={`${COLUMN_CLASS} flex flex-col gap-2 sm:gap-2.5 md:gap-3`}
                        >
                            {column.map((category) => (
                                <CategoryCard key={category.id} category={category} />
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

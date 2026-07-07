"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { StoreCategory } from "@/features/hyper-market/Categories/types/categories.types";
import { CategoryCard } from "./CategoryCard";

function buildColumns(categories: StoreCategory[]): StoreCategory[][] {
    const columns: StoreCategory[][] = [];
    for (let i = 0; i < categories.length; i += 2) {
        columns.push(categories.slice(i, i + 2));
    }
    return columns;
}

const COLUMN_CLASS =
    "w-[calc((100%-1.25rem)/3)] min-w-[5.75rem] max-w-[7rem] shrink-0 snap-start sm:min-w-[6.75rem] sm:max-w-[7.5rem] md:max-w-[8rem] lg:max-w-[9rem] xl:max-w-[9.5rem]";

const H_SCROLL = [
    "flex gap-2.5 overflow-x-auto pb-1 sm:gap-3",
    "snap-x snap-mandatory scroll-smooth",
    "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
    "-mx-0.5 px-0.5",
].join(" ");

const VIEW_ALL_BTN = [
    "inline-flex min-h-[36px] items-center gap-1 rounded-lg px-2.5 py-1.5",
    "bg-[#EBFEEB] text-xs font-bold text-[#30913F]",
    "dark:bg-[#30913F]/15 dark:text-[#4db860]",
    "transition-colors active:bg-[#DCF5DC] dark:active:bg-[#30913F]/25",
    "sm:gap-1.5 sm:px-3 sm:py-2 sm:text-sm",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900",
].join(" ");

interface CategoriesGridClientProps {
    categories: StoreCategory[];
}

export function CategoriesGridClient({ categories }: CategoriesGridClientProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    const columns = buildColumns(categories);
    const hasMultipleColumns = columns.length > 3;
    const viewAllHref = "/hyper-market/categories";

    if (categories.length === 0) return null;

    return (
        <section
            aria-label="تصنيفات المتجر"
            className="bg-white px-3 pb-5 pt-3 dark:bg-gray-900 sm:px-5 lg:px-6"
            dir="rtl"
        >
            <div className="mb-3 flex items-center justify-between gap-3">
                <h2 className="text-base font-bold text-[#111B18] dark:text-gray-50 sm:text-lg">
                    الاقسام
                </h2>

                <Link href={viewAllHref} className={VIEW_ALL_BTN}>
                    <span>عرض الكل</span>
                    <ArrowLeft className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden />
                </Link>
            </div>

            <div className="relative">
                {hasMultipleColumns && (
                    <div
                        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-white via-white/80 to-transparent dark:from-gray-900 dark:via-gray-900/80 sm:w-12"
                        aria-hidden
                    />
                )}

                <div ref={scrollRef} className={H_SCROLL}>
                    {columns.map((column) => (
                        <div
                            key={column.map((c) => c.id).join("-")}
                            className={`${COLUMN_CLASS} flex flex-col gap-2 sm:gap-2.5`}
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

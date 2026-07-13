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

const COLUMN_CLASS =
    "w-[calc((100%-1.25rem)/3)] min-w-[5.75rem] max-w-[7rem] shrink-0 snap-start sm:min-w-[6.75rem] sm:max-w-[7.5rem] md:max-w-[8rem] lg:max-w-[9rem] xl:max-w-[9.5rem]";

const H_SCROLL = [
    "flex gap-2.5 overflow-x-auto pb-1 sm:gap-3",
    "snap-x snap-mandatory scroll-smooth",
    "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
    "-mx-0.5 px-0.5",
].join(" ");


const VIEW_MORE_BTN = [
    "inline-flex min-h-[36px] shrink-0 items-center rounded-lg px-3 py-1.5",
    "bg-[#F0F0F0] text-xs font-medium text-gray-800",
    "dark:bg-gray-800 dark:text-gray-200",
    "transition-colors active:bg-[#E4E4E4] dark:active:bg-gray-700",
    "sm:px-3.5 sm:py-2 sm:text-sm",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900",
].join(" ");

interface CategoriesGridClientProps {
    categories: StoreCategory[];
}

export function CategoriesGridClient({ categories }: CategoriesGridClientProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    const columns = buildColumns(categories);
    const hasMultipleColumns = columns.length > 3;

    if (categories.length === 0) return null;

    return (
        <section
            aria-label="تصنيفات المتجر"
            className="bg-transparent px-3 pb-5 pt-3 sm:px-5 lg:px-6"
            dir="rtl"
        >
            <div className="mb-3 flex items-center justify-between gap-3">
                <h2 className="text-base font-bold text-[#111B18] dark:text-gray-50 sm:text-lg">
                    الاقسام
                </h2>

                <Link href={'/hyper-market/categories'} className={VIEW_MORE_BTN}>
                    تطلع على المزيد
                </Link>
            </div>

            <div className="relative">
                {hasMultipleColumns && (
                    <div
                        className="pointer-events-none absolute inset-y-0 start-0 z-10 w-10 bg-gradient-to-r from-[#F6F5F8] via-[#F6F5F8]/80 to-transparent dark:from-gray-950 dark:via-gray-950/80 sm:w-12"
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

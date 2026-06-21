"use client";

import { StoreCategory } from "@/features/hyper-market/Categories/types/categories.types";
import { CategoryCard } from "./CategoryCard";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

function buildColumns(categories: StoreCategory[]): StoreCategory[][] {
    const columns: StoreCategory[][] = [];
    for (let i = 0; i < categories.length; i += 2) {
        columns.push(categories.slice(i, i + 2));
    }
    return columns;
}

const SCROLL_ITEM =
    "w-[calc((100%-1.5rem)/4)] max-w-[5.625rem] shrink-0 snap-start sm:max-w-[6.25rem] md:max-w-[7rem]";

const H_SCROLL =
    "flex gap-2.5 overflow-x-auto pb-1 sm:gap-3 snap-x snap-mandatory scroll-smooth scrollbar-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden";

interface CategoriesGridClientProps {
    categories: StoreCategory[];
}

export function CategoriesGridClient({ categories }: CategoriesGridClientProps) {
    const columns = buildColumns(categories);

    return (
        <section aria-label="تصنيفات المتجر" className="bg-white px-4 pb-5 pt-2 sm:px-6">
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-[#111B18] sm:text-base">التصنيفات</h2>
                <Link href={`/hyper-market/categories?categoryId=${categories[0].id}`} className="flex items-center gap-2 px-2 py-1 font-bold bg-[#EBFEEB] rounded-lg w-fit mx-4">
                    <span className="text-sm text-[#30913F]">عرض الكل</span>
                    <ArrowLeft className="w-5 h-5 text-[#30913F]" strokeWidth={1.8} />
                </Link>
            </div>
            <div className={H_SCROLL}>
                {columns.map((column) => (
                    <div key={column.map((c) => c.id).join("-")} className={`${SCROLL_ITEM} flex flex-col gap-2`}>
                        {column.map((category) => (
                            <CategoryCard key={category.id} category={category} />
                        ))}
                    </div>
                ))}
            </div>


        </section>
    );
}

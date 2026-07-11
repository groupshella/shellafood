"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { HyperMarketPopularBrand } from "@/features/hyper-market/StoreDetails/types/popular-brands.types";
import { BrandCard } from "./BrandCard";

const COLUMN_CLASS =
    "flex w-[43vw] min-w-[8.5rem] max-w-[13rem] shrink-0 snap-start flex-col gap-2 sm:w-[30vw] sm:min-w-[10rem] sm:max-w-[14rem] sm:gap-2.5 lg:w-[22vw] lg:max-w-[15rem] xl:w-[18vw]";

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

function chunkByTwo(items: HyperMarketPopularBrand[]): HyperMarketPopularBrand[][] {
    const columns: HyperMarketPopularBrand[][] = [];
    for (let i = 0; i < items.length; i += 2) {
        columns.push(items.slice(i, i + 2));
    }
    return columns;
}

export function PopularBrandsClient({ brands }: { brands: HyperMarketPopularBrand[] }) {
    const scrollRef = useRef<HTMLDivElement>(null);

    const columns = chunkByTwo(brands);
    const hasMultipleColumns = columns.length > 3;
    const viewAllHref = "/brands";

    return (
        <section
            aria-label="أشهر العلامات التجارية"
            className="w-full bg-transparent px-3 pb-5 pt-3 sm:px-5 lg:px-6"
            dir="rtl"
        >
            <div className="mb-3 flex items-center justify-between gap-3">
                <h2 className="text-base font-bold text-[#111B18] dark:text-gray-50 sm:text-lg">
                    أشهر العلامات التجارية
                </h2>

                <Link href={viewAllHref} className={VIEW_ALL_BTN}>
                    <span>عرض الكل</span>
                    <ArrowLeft className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden />
                </Link>
            </div>

            <div className="relative">


                <div ref={scrollRef} className={H_SCROLL}>
                    {columns.map((column) => (
                        <div
                            key={column.map((brand) => brand.id).join("-")}
                            className={COLUMN_CLASS}
                        >
                            {column.map((brand) => (
                                <BrandCard key={brand.id} brand={brand} />
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

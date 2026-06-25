"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronLeft } from "lucide-react";
import { HyperMarketPopularBrand } from "@/features/hyper-market/StoreDetails/types/popular-brands.types";
import { BrandCard } from "./BrandCard";

const COLUMN_WIDTH = "calc((100% - 0.75rem) / 2.08)";

const H_SCROLL = [
    "flex gap-2.5 overflow-x-auto pb-1 sm:gap-3",
    "snap-x snap-mandatory scroll-smooth",
    "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
    "-mx-0.5 px-0.5",
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
    const [canScrollMore, setCanScrollMore] = useState(false);

    const columns = chunkByTwo(brands);
    const hasMultipleColumns = columns.length > 3;
    const viewAllHref = "/hyper-market/brands";

    const updateScrollHint = useCallback(() => {
        const el = scrollRef.current;
        if (!el) return;

        const maxScroll = el.scrollWidth - el.clientWidth;
        if (maxScroll <= 4) {
            setCanScrollMore(false);
            return;
        }

        const scrolled = Math.abs(el.scrollLeft);
        setCanScrollMore(scrolled < maxScroll - 8);
    }, []);

    useEffect(() => {
        updateScrollHint();
        const el = scrollRef.current;
        if (!el) return;

        el.addEventListener("scroll", updateScrollHint, { passive: true });
        window.addEventListener("resize", updateScrollHint);
        return () => {
            el.removeEventListener("scroll", updateScrollHint);
            window.removeEventListener("resize", updateScrollHint);
        };
    }, [brands, updateScrollHint]);

    return (
        <section
            aria-label="أشهر العلامات التجارية"
            className="w-full bg-[#F5F5F5] px-4 pb-5 pt-3 sm:px-5"
            dir="rtl"
        >
            <div className="mb-3 flex items-center justify-between gap-3">
                <h2 className="text-base font-bold text-[#111B18] sm:text-lg">أشهر العلامات التجارية</h2>

                <div className="flex shrink-0 items-center gap-2">
                    {hasMultipleColumns && canScrollMore && (
                        <span className="hidden items-center gap-1 text-[11px] font-medium text-gray-400 sm:inline-flex sm:text-xs">
                            اسحب للمزيد
                            <ChevronLeft className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden />
                        </span>
                    )}

                    <Link
                        href={viewAllHref}
                        className={[
                            "inline-flex items-center gap-1 rounded-lg bg-[#EBFEEB] px-2.5 py-1.5",
                            "text-xs font-bold text-[#30913F] sm:gap-1.5 sm:px-3 sm:py-2 sm:text-sm",
                            "transition-colors active:bg-[#DCF5DC]",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2",
                        ].join(" ")}
                    >
                        <span>عرض الكل</span>
                        <ArrowLeft className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden />
                    </Link>
                </div>
            </div>

            <div className="relative">
                {hasMultipleColumns && canScrollMore && (
                    <div
                        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-[#F5F5F5] via-[#F5F5F5]/80 to-transparent sm:w-12"
                        aria-hidden
                    />
                )}

                <div ref={scrollRef} className={H_SCROLL}>
                    {columns.map((column) => (
                        <div
                            key={column.map((brand) => brand.id).join("-")}
                            className="flex shrink-0 snap-start flex-col gap-2 sm:gap-2.5"
                            style={{ width: COLUMN_WIDTH }}
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

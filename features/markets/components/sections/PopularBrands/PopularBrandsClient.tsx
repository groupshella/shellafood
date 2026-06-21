"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft } from "lucide-react";
import { PopularBrand } from "@/features/markets/types/popular-brands.types";
import { BrandCard } from "./BrandCard";

const COLUMN_WIDTH = "calc((100% - 0.75rem) / 2.08)";

function chunkByTwo(items: PopularBrand[]): PopularBrand[][] {
    const columns: PopularBrand[][] = [];
    for (let i = 0; i < items.length; i += 2) {
        columns.push(items.slice(i, i + 2));
    }
    return columns;
}

export function PopularBrandsClient({ brands }: { brands: PopularBrand[] }) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollMore, setCanScrollMore] = useState(false);

    const columns = chunkByTwo(brands);
    const hasMultipleColumns = columns.length > 2;

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
        <section aria-label="أشهر العلامات التجارية" className="w-full space-y-3" dir="rtl">
            <div className="flex items-center justify-between gap-3 px-4 sm:px-6">
                <h2 className="text-lg font-bold text-gray-800">أشهر العلامات التجارية</h2>
                {hasMultipleColumns && canScrollMore && (
                    <span className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-gray-400">
                        <span className="hidden sm:inline">اسحب للمزيد</span>
                        <ChevronLeft className="h-4 w-4" strokeWidth={2.5} aria-hidden />
                    </span>
                )}
            </div>

            <div className="relative">
                {hasMultipleColumns && canScrollMore && (
                    <div
                        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-14 bg-gradient-to-r from-white via-white/70 to-transparent sm:w-16"
                        aria-hidden
                    />
                )}

                <div
                    ref={scrollRef}
                    className={[
                        "flex gap-3 overflow-x-auto px-4 pb-1 sm:px-6",
                        "snap-x snap-mandatory scroll-smooth",
                        "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
                        hasMultipleColumns ? "scroll-pl-4 sm:scroll-pl-6" : "",
                    ].join(" ")}
                    dir="rtl"
                >
                    {columns.map((column) => (
                        <div
                            key={column.map((brand) => brand.id).join("-")}
                            className="flex shrink-0 snap-start flex-col gap-3"
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

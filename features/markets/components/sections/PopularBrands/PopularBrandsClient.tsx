"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft } from "lucide-react";
import { PopularBrand } from "@/features/markets/types/popular-brands.types";
import { BrandCard } from "./BrandCard";

function chunkByTwo(items: PopularBrand[]): PopularBrand[][] {
    const columns: PopularBrand[][] = [];
    for (let i = 0; i < items.length; i += 2) {
        columns.push(items.slice(i, i + 2));
    }
    return columns;
}

export function PopularBrandsClient({ brands, isArabic }: { brands: PopularBrand[], isArabic: boolean }) {
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
        <section aria-label={isArabic ? "أشهر العلامات التجارية" : "Popular Brands"} className="w-full space-y-3" dir={isArabic ? "rtl" : "ltr"}>
            <div className="mx-auto flex w-full max-w-lg items-center justify-between gap-3 px-3 sm:max-w-2xl sm:px-5 lg:max-w-4xl lg:px-6 xl:max-w-5xl 2xl:max-w-6xl">
                <h2 className="text-base font-bold text-gray-800 dark:text-gray-100 sm:text-lg">
                    {isArabic ? "أشهر العلامات التجارية" : "Popular Brands"}
                </h2>
                {hasMultipleColumns && canScrollMore && (
                    <span className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-gray-400 dark:text-gray-500">
                        <span className="hidden sm:inline">{isArabic ? "اسحب للمزيد" : "Pull for more"}</span>
                        <ChevronLeft className="h-4 w-4" strokeWidth={2.5} aria-hidden />
                    </span>
                )}
            </div>

            <div className="relative">
                {hasMultipleColumns && canScrollMore && (
                    <div
                        className="pointer-events-none absolute inset-y-0 end-0 z-10 w-14 bg-gradient-to-r from-[#F6F5F8] via-[#F6F5F8]/70 to-transparent dark:from-gray-950 dark:via-gray-950/70 sm:w-16"
                        aria-hidden
                    />
                )}

                <div
                    ref={scrollRef}
                    className={[
                        "mx-auto flex w-full max-w-lg gap-2.5 overflow-x-auto px-3 pb-1 sm:max-w-2xl sm:gap-3 sm:px-5 lg:max-w-4xl lg:px-6 xl:max-w-5xl 2xl:max-w-6xl",
                        "snap-x snap-mandatory scroll-smooth",
                        "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
                        hasMultipleColumns ? "scroll-pe-4 sm:scroll-pe-5 lg:scroll-pe-6" : "",
                    ].join(" ")}
                    dir={isArabic ? "rtl" : "ltr"}
                >
                    {columns.map((column) => (
                        <div
                            key={column.map((brand) => brand.id).join("-")}
                            className="flex w-[43vw] min-w-[8.5rem] max-w-[13rem] shrink-0 snap-start flex-col gap-2.5 sm:w-[30vw] sm:min-w-[10rem] sm:max-w-[14rem] sm:gap-3 lg:w-[22vw] lg:max-w-[15rem] xl:w-[18vw]"
                        >
                            {column.map((brand) => (
                                <BrandCard key={brand.id} brand={brand} isArabic={isArabic} />
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { usePopularBrands } from "../hooks/usePopularBrands";
import { PopularBrand } from "../types/popular-brands.types";

const COLUMN_WIDTH = "calc((100% - 0.75rem) / 2.08)";

function chunkByTwo(items: PopularBrand[]): PopularBrand[][] {
    const columns: PopularBrand[][] = [];
    for (let i = 0; i < items.length; i += 2) {
        columns.push(items.slice(i, i + 2));
    }
    return columns;
}

function BrandCard({ brand }: { brand: PopularBrand }) {
    const [logoError, setLogoError] = useState(false);
    const name = brand.name?.trim() || "";

    return (
        <div
            className={[
                "flex min-h-[76px] items-center gap-3 rounded-2xl bg-white p-3",
                "ring-1 ring-black/[0.06]",
            ].join(" ")}
            aria-label={name}
        >
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-gray-50 ring-1 ring-black/[0.04]">
                {!logoError && brand.image_full_url ? (
                    <Image
                        src={brand.image_full_url}
                        alt=""
                        fill
                        className="object-contain p-1.5"
                        sizes="56px"
                        loading="lazy"
                        onError={() => setLogoError(true)}
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-100 text-xs text-gray-400">
                        {name.charAt(0)}
                    </div>
                )}
            </div>

            <h3 className="line-clamp-2 min-w-0 flex-1 text-sm font-bold text-gray-900 sm:text-[15px]">
                {name}
            </h3>
        </div>
    );
}

function PopularBrandsSkeleton() {
    return (
        <div className="w-full space-y-3 px-4 sm:px-6">
            <div className="h-7 w-48 animate-pulse rounded-lg bg-gray-100" />
            <div className="flex gap-3 overflow-hidden">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div
                        key={i}
                        className="flex shrink-0 flex-col gap-3"
                        style={{ width: COLUMN_WIDTH }}
                    >
                        <div className="h-[76px] animate-pulse rounded-2xl bg-gray-100" />
                        <div className="h-[76px] animate-pulse rounded-2xl bg-gray-100" />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function PopularBrands({ moduleId }: { moduleId: string; moduleName: string }) {
    const { brands, isLoading, error } = usePopularBrands(moduleId);
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

    if (isLoading) return <PopularBrandsSkeleton />;
    if (error || brands.length === 0) return null;

    return (
        <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.13 }}
            aria-label="أشهر العلامات التجارية"
            className="w-full space-y-3"
            dir="rtl"
        >
            <div className="flex items-center justify-between gap-3 px-4 sm:px-6">
                <h2 className="text-lg font-bold text-gray-800">أشهر العلامات التجارية</h2>
                {hasMultipleColumns && canScrollMore && (
                    <span className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-gray-400">
                        <span className="hidden sm:inline">اسحب للمزيد</span>
                        <motion.span
                            animate={{ x: [0, -4, 0] }}
                            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                            aria-hidden
                        >
                            <ChevronLeft className="h-4 w-4" strokeWidth={2.5} />
                        </motion.span>
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
        </motion.section>
    );
}

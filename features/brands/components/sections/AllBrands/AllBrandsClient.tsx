"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Brand } from "@/features/brands/types/brands.types";
import { BrandGridCard } from "./BrandGridCard";

const ICON_BTN = [
    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-gray-700",
    "transition-colors hover:bg-gray-50 active:scale-95",
    "dark:text-gray-300 dark:hover:bg-gray-800",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-950",
].join(" ");

interface AllBrandsClientProps {
    brands: Brand[];
    isArabic: boolean;
}

export function AllBrandsClient({ brands, isArabic }: AllBrandsClientProps) {
    if (brands.length === 0) return null;

    return (
        <div className="min-h-dvh bg-[#F5F5F5] dark:bg-gray-950" dir={isArabic ? "rtl" : "ltr"}>
            <header className="sticky top-0 z-20 border-b border-black/[0.04] bg-white/95 backdrop-blur-md dark:border-white/[0.06] dark:bg-gray-900/95">
                <div className="relative flex min-h-[3.25rem] items-center justify-center px-3 py-2.5 sm:px-5">
                    <Link
                        href="/home"
                        className={`${ICON_BTN} absolute start-3 sm:start-5`}
                        aria-label={isArabic ? "العودة" : "Return"}
                    >
                        <ChevronRight className="h-5 w-5 text-gray-700 dark:text-gray-300" strokeWidth={2} aria-hidden />
                    </Link>

                    <h1 className="max-w-[70%] truncate text-base font-bold text-gray-900 dark:text-gray-50 sm:text-lg md:text-xl">
                        {isArabic ? "اشهر العلامات التجارية" : "Most Popular Brands"}
                    </h1>
                </div>
            </header>

            <section aria-label="جميع العلامات التجارية" className="px-3 pb-6 pt-4 sm:px-5 lg:px-6">
                <div className="grid grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-3 lg:grid-cols-4 lg:gap-4 xl:grid-cols-5">
                    {brands.map((brand) => (
                        <Link
                            key={brand.id}
                            href={`/brands/${brand.id}`}
                            className="block rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-950"
                        >
                            <BrandGridCard brand={brand} isArabic={isArabic} />
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
}

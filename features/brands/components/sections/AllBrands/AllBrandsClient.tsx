"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Brand } from "@/features/brands/types/brands.types";
import { BrandGridCard } from "./BrandGridCard";

const ICON_BTN = [
    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-foreground",
    "transition-colors hover:bg-card active:scale-95",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background",
].join(" ");

interface AllBrandsClientProps {
    brands: Brand[];
    isArabic: boolean;
}

export function AllBrandsClient({ brands, isArabic }: AllBrandsClientProps) {
    if (brands.length === 0) return null;

    return (
        <div
            className="min-h-dvh bg-background"
            dir={isArabic ? "rtl" : "ltr"}
            lang={isArabic ? "ar" : "en"}
        >
            <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur-md">
                <div className="relative flex min-h-[3.25rem] items-center justify-center px-3 py-2.5 sm:px-5 md:px-6">
                    <Link
                        href="/home"
                        className={`${ICON_BTN} absolute start-3 sm:start-5`}
                        aria-label={isArabic ? "العودة" : "Go back"}
                    >
                        <ChevronRight
                            className={[
                                "h-5 w-5 text-brand",
                                isArabic ? "" : "rotate-180",
                            ].join(" ")}
                            strokeWidth={2}
                            aria-hidden
                        />
                    </Link>

                    <h1 className="max-w-[70%] truncate text-base font-bold text-foreground sm:text-lg md:text-xl">
                        {isArabic ? "اشهر العلامات التجارية" : "Popular brands"}
                    </h1>
                </div>
            </header>

            <section
                aria-label={isArabic ? "جميع العلامات التجارية" : "All brands"}
                className="px-3 pb-6 pt-4 sm:px-5 lg:px-6"
            >
                <div className="grid grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-3 lg:grid-cols-4 lg:gap-4 xl:grid-cols-5">
                    {brands.map((brand) => (
                        <Link
                            key={brand.id}
                            href={`/brands/${brand.id}`}
                            className="block rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                        >
                            <BrandGridCard brand={brand} />
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
}

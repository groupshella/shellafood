"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Brand } from "@/features/hyper-market/Brands/types/brands.types";
import { BrandGridCard } from "./BrandGridCard";

const ICON_BTN =
    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-gray-700 transition-colors hover:bg-gray-50 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2";

interface AllBrandsClientProps {
    brands: Brand[];
}

export function AllBrandsClient({ brands }: AllBrandsClientProps) {
    if (brands.length === 0) return null;

    return (
        <div className="min-h-screen bg-[#F5F5F5]">
            <header className="sticky top-0 z-20 border-b border-black/[0.04] bg-white/95 backdrop-blur-md">
                <div className="relative flex min-h-[3.25rem] items-center justify-center px-4 py-2.5">
                    <Link
                        href="/hyper-market"
                        className={`${ICON_BTN} absolute right-4`}
                        aria-label="العودة إلى هايبر ماركت"
                    >
                        <ArrowRight className="h-5 w-5 text-[#30913F]" strokeWidth={2} />
                    </Link>

                    <h1 className="text-base font-bold text-gray-900">العلامات التجارية</h1>
                </div>
            </header>

            <section aria-label="جميع العلامات التجارية" className="px-4 pb-6 pt-4 sm:px-5">
                <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                    {brands.map((brand) => (
                        <BrandGridCard key={brand.id} brand={brand} />
                    ))}
                </div>
            </section>
        </div>
    );
}

"use client";

import { useSearchContext } from "@/features/search/components/SearchContext";
import { PopularBrand } from "@/features/search/types/popular-brands.types";
import { BrandCard } from "./BrandCard";

const SECTION_HEADING =
    "text-sm font-semibold text-gray-500 dark:text-gray-400 sm:text-base lg:text-lg";

const BRANDS_GRID =
    "grid grid-cols-5 gap-1.5 sm:grid-cols-5 sm:gap-3 md:grid-cols-6 lg:grid-cols-8 lg:gap-4 xl:grid-cols-10";

interface PopularBrandsClientProps {
    brands: PopularBrand[];
}

export function PopularBrandsClient({ brands }: PopularBrandsClientProps) {
    const { handleSelect } = useSearchContext();

    return (
        <section aria-label="أشهر العلامات التجارية" className="space-y-3 sm:space-y-4">
            <h2 className={SECTION_HEADING}>أشهر العلامات التجارية</h2>

            <div className={BRANDS_GRID}>
                {brands.map((brand) => (
                    <BrandCard key={brand.id} brand={brand} onSelect={handleSelect} />
                ))}
            </div>
        </section>
    );
}

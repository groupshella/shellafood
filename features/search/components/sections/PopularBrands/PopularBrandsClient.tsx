"use client";

import { useSearchContext } from "@/features/search/components/SearchContext";
import { PopularBrand } from "@/features/search/types/popular-brands.types";
import { BrandCard } from "./BrandCard";

interface PopularBrandsClientProps {
    brands: PopularBrand[];
}

export function PopularBrandsClient({ brands }: PopularBrandsClientProps) {
    const { handleSelect } = useSearchContext();

    return (
        <section aria-label="أشهر العلامات التجارية" className="space-y-3">
            <h2 className="text-base font-medium text-neutral-500">أشهر العلامات التجارية</h2>

            <div className="grid grid-cols-5 gap-2.5">
                {brands.map((brand) => (
                    <BrandCard key={brand.id} brand={brand} onSelect={handleSelect} />
                ))}
            </div>
        </section>
    );
}

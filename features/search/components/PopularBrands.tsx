"use client";

import { useState } from "react";
import Image from "next/image";
import { usePopularBrands } from "@/features/search/hooks/usePopularBrands";
import { PopularBrand } from "@/features/search/types/popular-brands.types";

function BrandCard({ brand, onSelect }: { brand: PopularBrand; onSelect: (name: string) => void }) {
    const [logoError, setLogoError] = useState(false);
    const name = brand.name?.trim() || "";

    return (
        <button
            type="button"
            onClick={() => onSelect(name)}
            className={[
                "flex aspect-square w-full items-center justify-center rounded-xl bg-white p-2.5",
                "transition-transform active:scale-[0.96]",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2 focus-visible:ring-offset-black",
            ].join(" ")}
            aria-label={name}
        >
            <div className="relative h-full w-full">
                {!logoError && brand.image_full_url ? (
                    <Image
                        src={brand.image_full_url}
                        alt=""
                        fill
                        className="object-contain"
                        sizes="(max-width: 640px) 20vw, 80px"
                        loading="lazy"
                        onError={() => setLogoError(true)}
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm font-bold text-gray-400">
                        {name.charAt(0)}
                    </div>
                )}
            </div>
        </button>
    );
}

function PopularBrandsSkeleton() {
    return (
        <div className="space-y-3">
            <div className="h-5 w-40 animate-pulse rounded bg-gray-400" />
            <div className="grid grid-cols-5 gap-2.5">
                {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className="aspect-square animate-pulse rounded-xl bg-gray-400" />
                ))}
            </div>
        </div>
    );
}

interface PopularBrandsProps {
    moduleId: string | undefined;
    onSelect: (name: string) => void;
}

export default function PopularBrands({ moduleId, onSelect }: PopularBrandsProps) {
    const { brands, isLoading, error } = usePopularBrands(moduleId);

    if (isLoading) return <PopularBrandsSkeleton />;
    if (error || brands.length === 0) return null;

    return (
        <section aria-label="أشهر العلامات التجارية" className="space-y-3">
            <h2 className="text-base font-medium text-neutral-500">أشهر العلامات التجارية</h2>

            <div className="grid grid-cols-5 gap-2.5">
                {brands.map((brand) => (
                    <BrandCard key={brand.id} brand={brand} onSelect={onSelect} />
                ))}
            </div>
        </section>
    );
}

"use client";

import { memo, useCallback, useState } from "react";
import Image from "next/image";
import { PopularBrand } from "@/features/search/types/popular-brands.types";

interface BrandCardProps {
    brand: PopularBrand;
    onSelect: (name: string) => void;
}

export const BrandCard = memo(function BrandCard({ brand, onSelect }: BrandCardProps) {
    const [logoError, setLogoError] = useState(false);
    const name = brand.name?.trim() || "";

    const handleSelect = useCallback(() => {
        onSelect(name);
    }, [onSelect, name]);

    const handleLogoError = useCallback(() => {
        setLogoError(true);
    }, []);

    return (
        <button
            type="button"
            onClick={handleSelect}
            className={[
                "flex aspect-square w-full min-w-0 items-center justify-center rounded-lg bg-white p-1",
                "shadow-sm ring-1 ring-black/[0.04] dark:bg-gray-800 dark:ring-white/[0.06]",
                "transition-transform active:scale-[0.95]",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-950",
                "sm:rounded-2xl sm:p-2",
            ].join(" ")}
            aria-label={name}
        >
            <div className="relative h-full w-full min-w-0">
                {!logoError && brand.image_full_url ? (
                    <Image
                        src={brand.image_full_url}
                        alt=""
                        fill
                        className="object-contain"
                        sizes="(max-width: 640px) 15vw, (max-width: 1024px) 10vw, 80px"
                        loading="lazy"
                        onError={handleLogoError}
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs font-bold text-gray-400 dark:text-gray-500 sm:text-sm">
                        {name.charAt(0)}
                    </div>
                )}
            </div>
        </button>
    );
});

"use client";

import { useState } from "react";
import Image from "next/image";
import { PopularBrand } from "@/features/search/types/popular-brands.types";

interface BrandCardProps {
    brand: PopularBrand;
    onSelect: (name: string) => void;
}

export function BrandCard({ brand, onSelect }: BrandCardProps) {
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

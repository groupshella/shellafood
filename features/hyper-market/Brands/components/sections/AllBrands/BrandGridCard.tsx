"use client";

import Image from "next/image";
import { useState } from "react";
import { Brand } from "@/features/hyper-market/Brands/types/brands.types";

interface BrandGridCardProps {
    brand: Brand;
}

export function BrandGridCard({ brand }: BrandGridCardProps) {
    const [imageError, setImageError] = useState(false);
    const name = brand.name?.trim() || "";

    return (
        <div
            className={[
                "flex min-h-[76px] w-full min-w-0 items-center gap-2 rounded-2xl bg-white p-2.5 sm:gap-3 sm:p-3",
                "ring-1 ring-black/[0.06]",
            ].join(" ")}
            aria-label={name}
        >
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-gray-50 ring-1 ring-black/[0.04] sm:h-14 sm:w-14">
                {!imageError && brand.image_full_url ? (
                    <Image
                        src={brand.image_full_url}
                        alt=""
                        fill
                        className="object-contain p-1.5"
                        sizes="56px"
                        loading="lazy"
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-100 text-xs font-bold text-gray-400">
                        {name.charAt(0)}
                    </div>
                )}
            </div>

            <h3 className="line-clamp-2 min-w-0 flex-1 text-xs font-bold text-gray-900 sm:text-sm">
                {name}
            </h3>
        </div>
    );
}

"use client";

import Image from "next/image";
import { memo, useCallback, useState } from "react";
import { Brand } from "@/features/brands/types/brands.types";

interface BrandGridCardProps {
    brand: Brand;
}

export const BrandGridCard = memo(function BrandGridCard({ brand }: BrandGridCardProps) {
    const [imageError, setImageError] = useState(false);
    const name = brand.name?.trim() || "";

    const handleImageError = useCallback(() => {
        setImageError(true);
    }, []);

    return (
        <div
            className={[
                "flex min-h-[72px] w-full min-w-0 items-center gap-2 rounded-2xl bg-card p-2.5 sm:min-h-[76px] sm:gap-3 sm:p-3 md:min-h-[80px]",
                "ring-1 ring-border",
                "transition-colors hover:brightness-95",
            ].join(" ")}
            aria-label={name}
        >
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-background ring-1 ring-border sm:h-14 sm:w-14">
                {!imageError && brand.image_full_url ? (
                    <Image
                        src={brand.image_full_url}
                        alt=""
                        fill
                        className="object-contain p-1.5"
                        sizes="56px"
                        loading="lazy"
                        onError={handleImageError}
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-card text-xs font-bold text-muted">
                        {name.charAt(0)}
                    </div>
                )}
            </div>

            <h3 className="line-clamp-2 min-w-0 flex-1 text-start text-xs font-bold text-foreground sm:text-sm">
                {name}
            </h3>
        </div>
    );
});

"use client";

import { memo, useCallback, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { StoreCategory } from "@/features/hyper-market/Categories/types/categories.types";

interface CategoryCardProps {
    category: StoreCategory;
}

export const CategoryCard = memo(function CategoryCard({ category }: CategoryCardProps) {
    const [imageError, setImageError] = useState(false);

    const handleImageError = useCallback(() => {
        setImageError(true);
    }, []);

    return (
        <Link
            href={`/hyper-market/categories?categoryId=${category.id}`}
            className="
                group relative flex aspect-square w-full shrink-0 flex-col
                overflow-hidden rounded-2xl
                bg-brand/10
                outline-none
                transition-transform duration-150
                active:scale-[0.96]
                focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background
            "
            aria-label={category.name}
        >
            <div
                aria-hidden
                className="pointer-events-none absolute -end-6 bottom-0 h-[78%] w-[78%] rounded-[40%] bg-background/70 blur-[1px]"
                style={{ transform: "rotate(-12deg)" }}
            />

            <div
                aria-hidden
                className="pointer-events-none absolute -bottom-6 -start-6 h-16 w-16 rounded-full bg-brand/25 blur-md"
            />

            <h3
                className="
                relative z-10
                line-clamp-2
                px-2 pt-2.5
                text-center text-[10px] font-bold leading-tight
                text-brand
                sm:text-[11px] md:text-xs lg:text-[13px]
            "
            >
                {category.name}
            </h3>

            <div className="absolute inset-x-0 bottom-0 z-10 h-[62%]">
                {!imageError && category.full_image_url ? (
                    <Image
                        src={category.full_image_url}
                        alt=""
                        fill
                        className="
                            object-contain object-bottom
                            transition-transform duration-200
                            group-active:scale-95
                        "
                        sizes="(max-width: 640px) 22vw, (max-width: 1024px) 112px, 144px"
                        loading="lazy"
                        onError={handleImageError}
                    />
                ) : (
                    <div
                        className="flex h-full items-end justify-center pb-2 text-2xl text-muted opacity-40"
                        aria-hidden
                    >
                        🛒
                    </div>
                )}
            </div>
        </Link>
    );
});

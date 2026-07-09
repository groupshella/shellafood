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
                bg-[#EBFEEB] dark:bg-[#0d2e12]/50
                outline-none
                transition-transform duration-150
                active:scale-[0.96]
                focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900
            "
            aria-label={category.name}
        >
            <div
                aria-hidden
                className="pointer-events-none absolute -end-6 bottom-0 h-[78%] w-[78%] rounded-[40%] bg-white/70 blur-[1px] dark:bg-white/10"
                style={{ transform: "rotate(-12deg)" }}
            />

            <div
                aria-hidden
                className="pointer-events-none absolute -bottom-6 -start-6 h-16 w-16 rounded-full bg-[#9DF7A6]/70 blur-md dark:bg-[#30913F]/30"
            />

            <h3
                className="
                relative z-10
                line-clamp-2
                px-2 pt-2.5
                text-center text-[10px] font-bold leading-tight
                text-[#166534] dark:text-[#4db860]
                sm:text-[11px] md:text-xs
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
                        sizes="(max-width: 640px) 22vw, 112px"
                        loading="lazy"
                        onError={handleImageError}
                    />
                ) : (
                    <div
                        className="flex h-full items-end justify-center pb-2 text-2xl opacity-20"
                        aria-hidden
                    >
                        🛒
                    </div>
                )}
            </div>
        </Link>
    );
});

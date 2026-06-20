"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { StoreCategory } from "@/features/hyper-market/Categories/types/categories.types";

interface CategoryCardProps {
    category: StoreCategory;
}

export function CategoryCard({ category }: CategoryCardProps) {
    const [imageError, setImageError] = useState(false);

    return (
        <Link
            href={`/hyper-market/categories?categoryId=${category.id}`}
            className="relative flex aspect-square w-full shrink-0 flex-col overflow-hidden rounded-2xl bg-[#EBFEEB] outline-none transition-transform duration-150 active:scale-[0.96] focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2"
            aria-label={category.name}
        >
            <h3 className="relative z-10 line-clamp-2 px-2 pt-2 text-center text-[10px] font-bold leading-tight text-[#2F8F3B] sm:text-[11px]">
                {category.name}
            </h3>
            <div className="absolute inset-x-0 bottom-0 h-[62%]">
                {!imageError && category.full_image_url ? (
                    <Image
                        src={category.full_image_url}
                        alt=""
                        fill
                        className="object-contain object-bottom"
                        sizes="(max-width: 640px) 22vw, 112px"
                        loading="lazy"
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <div className="flex h-full items-end justify-center pb-2 text-2xl opacity-25" aria-hidden>
                        🛒
                    </div>
                )}
            </div>
        </Link>
    );
}

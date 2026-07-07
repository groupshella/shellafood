"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { StoreCategory } from "@/features/hyper-market/Categories/types/categories.types";

interface CategoryGridCardProps {
    category: StoreCategory;
}

export function CategoryGridCard({ category }: CategoryGridCardProps) {
    const [imageError, setImageError] = useState(false);

    return (
        <Link
            href={`/hyper-market/categories?categoryId=${category.id}`}
            className={[
                "relative flex aspect-[4/5] w-full flex-col overflow-hidden rounded-2xl bg-[#E8F9EE] dark:bg-[#0d2e12]/50",
                "outline-none transition-transform duration-150 active:scale-[0.97]",
                "focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-950",
            ].join(" ")}
            aria-label={category.name}
        >
            <svg
                className="pointer-events-none absolute -bottom-6 left-1/2 h-[70%] w-[120%] -translate-x-1/2 text-[#C8EDD4] dark:text-[#1a4d2e]"
                viewBox="0 0 200 120"
                fill="currentColor"
                aria-hidden
            >
                <path d="M0 80 C40 40, 80 100, 120 60 C160 20, 180 90, 200 50 L200 120 L0 120 Z" />
            </svg>

            <h3 className="relative z-10 line-clamp-2 px-2 pt-2.5 text-center text-[11px] font-bold leading-tight text-[#1F6B3A] dark:text-[#4db860] sm:text-xs">
                {category.name}
            </h3>

            <div className="relative z-10 mt-auto h-[58%] w-full">
                {!imageError && category.full_image_url ? (
                    <Image
                        src={category.full_image_url}
                        alt=""
                        fill
                        className="object-contain object-bottom px-1 pb-1"
                        sizes="(max-width: 640px) 28vw, 120px"
                        loading="lazy"
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <div className="flex h-full items-end justify-center pb-2 text-xl opacity-30" aria-hidden>
                        🛒
                    </div>
                )}
            </div>
        </Link>
    );
}

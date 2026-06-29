"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Category } from "@/features/markets/types/categories.types";

interface CategoryCardProps {
    category: Category;
    moduleId: string;
    layout?: "scroll" | "grid";
}

export function CategoryCard({ category, moduleId, layout = "scroll" }: CategoryCardProps) {
    const [imageError, setImageError] = useState(false);
    const isGrid = layout === "grid";

    return (
        <Link
            href={`/modules/${moduleId}/category/${category.slug}`}
            className={[
                "group flex flex-col items-center gap-2.5",
                isGrid ? "w-full" : "w-[5.5rem] shrink-0 sm:w-[5.75rem]",
                "outline-none transition-transform duration-150 active:scale-[0.96]",
                "focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2 focus-visible:ring-offset-black",
            ].join(" ")}
            aria-label={category.name}
        >
            <div className="relative h-[72px] w-[72px] overflow-hidden rounded-full bg-white shadow-[0_1px_4px_rgba(0,0,0,0.08)] sm:h-[80px] sm:w-[80px]">
                {!imageError && category.image_full_url ? (
                    <Image
                        src={category.image_full_url}
                        alt=""
                        fill
                        className="object-contain p-2 transition-transform duration-200 group-active:scale-95"
                        sizes="80px"
                        loading="lazy"
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <div
                        className="flex h-full items-center justify-center text-2xl opacity-30"
                        aria-hidden
                    >
                        🍽️
                    </div>
                )}
            </div>

            <span className="line-clamp-2 w-full text-center text-xs leading-tight text-gray-400 sm:text-[13px]">
                {category.name}
            </span>
        </Link>
    );
}

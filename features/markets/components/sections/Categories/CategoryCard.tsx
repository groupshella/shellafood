"use client";

import { memo, useCallback, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Category } from "@/features/markets/types/categories.types";
import { useMarketsStoreOptional } from "@/features/markets/context/MarketsStoreContext";

const STORES_SECTION_ID = "module-stores";

interface CategoryCardProps {
    category: Category;
    moduleId: string;
    layout?: "scroll" | "grid";
    mode?: "filter" | "navigate";
}

function scrollToStores() {
    document.getElementById(STORES_SECTION_ID)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export const CategoryCard = memo(function CategoryCard({
    category,
    moduleId,
    layout = "scroll",
    mode = "navigate",
}: CategoryCardProps) {
    const [imageError, setImageError] = useState(false);
    const storeContext = useMarketsStoreOptional();
    const isGrid = layout === "grid";
    const isFilterMode = mode === "filter" && storeContext !== null;
    const isSelected =
        isFilterMode && storeContext.filters.categoryId === category.id;

    const handleImageError = useCallback(() => {
        setImageError(true);
    }, []);

    const sharedClassName = [
        "group flex flex-col items-center gap-2 sm:gap-2.5",
        isGrid ? "w-full" : "w-[4.75rem] shrink-0 sm:w-[5.5rem] md:w-[5.75rem] lg:w-24",
        "outline-none transition-transform duration-150 active:scale-[0.96]",
        "focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900",
    ].join(" ");

    const avatarClassName = [
        "relative h-14 w-14 overflow-hidden rounded-full bg-white shadow-[0_1px_4px_rgba(0,0,0,0.08)] sm:h-[72px] sm:w-[72px] md:h-20 md:w-20 lg:h-[88px] lg:w-[88px]",
        "transition-shadow duration-200 dark:bg-gray-800 dark:shadow-[0_1px_4px_rgba(0,0,0,0.25)]",
        isSelected && "ring-[3px] ring-[#30913F] ring-offset-2 ring-offset-white dark:ring-offset-gray-900",
    ]
        .filter(Boolean)
        .join(" ");

    const labelClassName = [
        "line-clamp-2 w-full text-center text-[11px] leading-tight sm:text-[13px] lg:text-sm",
        isSelected
            ? "font-semibold text-[#30913F] dark:text-[#4db860]"
            : "text-gray-400 dark:text-gray-500",
    ].join(" ");

    const content = (
        <>
            <div className={avatarClassName}>
                {!imageError && category.image_full_url ? (
                    <Image
                        src={category.image_full_url}
                        alt=""
                        fill
                        className="object-contain p-2 transition-transform duration-200 group-active:scale-95"
                        sizes="80px"
                        loading="lazy"
                        onError={handleImageError}
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

            <span className={labelClassName}>{category.name}</span>
        </>
    );

    if (isFilterMode) {
        const handleSelect = () => {
            const { filters, setFilters } = storeContext;
            const nextCategoryId = isSelected ? null : category.id;
            setFilters({ ...filters, categoryId: nextCategoryId });
            if (nextCategoryId !== null) scrollToStores();
        };

        return (
            <button
                type="button"
                onClick={handleSelect}
                className={sharedClassName}
                aria-label={category.name}
                aria-pressed={isSelected}
            >
                {content}
            </button>
        );
    }

    return (
        <Link
            href={`/modules/${moduleId}/category/${category.slug}`}
            className={sharedClassName}
            aria-label={category.name}
        >
            {content}
        </Link>
    );
});

"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { StoreCategory } from "@/features/hyper-market/Categories/types/categories.types";

const SCROLL_ROW =
    "flex gap-4 overflow-x-auto scroll-smooth snap-x scrollbar-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden";

interface CategoryTabsClientProps {
    categories: StoreCategory[];
    activeCategoryId: string;
}

export function CategoryTabsClient({ categories, activeCategoryId }: CategoryTabsClientProps) {
    const scrollRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const activeEl = scrollRef.current?.querySelector<HTMLElement>(
            `[data-tab-id="${activeCategoryId}"]`
        );
        activeEl?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }, [activeCategoryId]);

    return (
        <nav
            ref={scrollRef}
            aria-label="تصنيفات المتجر"
            className={`sticky top-[57px] z-30 border-b border-white/15 bg-[#30913F] px-4 py-2.5 sm:px-5 ${SCROLL_ROW}`}
            dir="rtl"
        >
            {categories.map((category) => {
                const id = String(category.id);
                const isActive = id === activeCategoryId;

                return (
                    <Link
                        key={category.id}
                        href={`/hyper-market/categories?categoryId=${category.id}`}
                        data-tab-id={id}
                        className={[
                            "relative shrink-0 snap-start pb-2 pt-1 text-sm font-semibold transition-colors",
                            isActive ? "text-white" : "text-white/75",
                        ].join(" ")}
                        aria-current={isActive ? "page" : undefined}
                    >
                        {category.name}
                        {isActive && (
                            <span className="absolute bottom-0 start-0 end-0 h-[3px] rounded-full bg-[#9DFCA3]" />
                        )}
                    </Link>
                );
            })}
        </nav>
    );
}

"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { StoreCategory } from "@/features/hyper-market/Categories/types/categories.types";

interface Props {
    categories: StoreCategory[];
    activeCategoryId: string;
}

/**
 * Main category bar — sticky at top (below any app header if present).
 * Text tabs with a mint-green underline on the active item.
 * Fixed height 44px so SubCategoryTabs can offset correctly below it.
 */
export function CategoryTabsClient({ categories, activeCategoryId }: Props) {
    const navRef = useRef<HTMLElement>(null);

    useEffect(() => {
        navRef.current
            ?.querySelector<HTMLElement>(`[data-id="${activeCategoryId}"]`)
            ?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }, [activeCategoryId]);

    return (
        <nav
            ref={navRef}
            dir="rtl"
            aria-label="تصنيفات المتجر"
            className="sticky top-0 z-50 flex h-[44px] items-center gap-5 overflow-x-auto border-b border-white/15 bg-[#30913F] px-4 sm:px-5
                       scrollbar-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
            {categories.map((cat) => {
                const id = String(cat.id);
                const active = id === activeCategoryId;
                return (
                    <Link
                        key={cat.id}
                        href={`/hyper-market/categories?categoryId=${cat.id}`}
                        data-id={id}
                        aria-current={active ? "page" : undefined}
                        className={[
                            "relative shrink-0 whitespace-nowrap pb-2 pt-1 text-sm font-semibold transition-colors",
                            active ? "text-white" : "text-white/70 hover:text-white/90",
                        ].join(" ")}
                    >
                        {cat.name}
                        {active && (
                            <span
                                aria-hidden
                                className="absolute bottom-0 inset-x-0 h-[3px] rounded-full bg-[#9DFCA3]"
                            />
                        )}
                    </Link>
                );
            })}
        </nav>
    );
}
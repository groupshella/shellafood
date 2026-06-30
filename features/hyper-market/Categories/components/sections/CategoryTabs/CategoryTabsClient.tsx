"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { ChevronRight } from "lucide-react";
import { StoreCategory } from "@/features/hyper-market/Categories/types/categories.types";

const ALL_CATEGORIES_HREF = "/hyper-market/categories";
const BACK_HREF = "/hyper-market";

const PIN_BTN = [
    "flex h-full shrink-0 items-center outline-none transition-opacity active:opacity-80",
    "focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-inset",
].join(" ");

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
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        scrollRef.current
            ?.querySelector<HTMLElement>(`[data-id="${activeCategoryId}"]`)
            ?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }, [activeCategoryId]);

    return (
        <nav
            dir="rtl"
            aria-label="تصنيفات المتجر"
            className="sticky top-0 z-50 flex h-[44px] items-stretch border-b border-white/15 bg-[#30913F]"
        >
            <Link
                href={BACK_HREF}
                className={`${PIN_BTN} border-r border-white/15 px-3 sm:px-4`}
                aria-label="العودة إلى هايبر ماركت"
            >
                <ChevronRight className="h-5 w-5 text-white" strokeWidth={2} />
            </Link>

            <div
                ref={scrollRef}
                className="flex min-w-0 flex-1 items-center gap-5 overflow-x-auto px-4 sm:px-5
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
                                active ? "text-[#9DFCA3]" : "text-white/70 hover:text-white/90",
                            ].join(" ")}
                        >
                            {cat.name}
                            {active && (
                                <span
                                    aria-hidden
                                    className="absolute inset-x-0 bottom-0 h-[3px] rounded-full bg-[#9DFCA3]"
                                />
                            )}
                        </Link>
                    );
                })}
            </div>



            <Link
                href={ALL_CATEGORIES_HREF}
                className={`${PIN_BTN} border-l border-white/15 px-3 sm:px-4`}
                aria-label="عرض جميع الأقسام"
            >
                <Image
                    src="/hyper-market/categories-grid.png"
                    alt=""
                    width={22}
                    height={22}
                    className="h-[22px] w-[22px] object-contain mix-blend-screen"
                />
            </Link>
        </nav>
    );
}

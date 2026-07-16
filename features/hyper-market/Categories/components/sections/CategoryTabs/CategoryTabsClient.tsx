"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
    isArabic: boolean;
}

export function CategoryTabsClient({
    categories,
    activeCategoryId,
    isArabic,
}: Props) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const BackIcon = isArabic ? ChevronRight : ChevronLeft;

    useEffect(() => {
        scrollRef.current
            ?.querySelector<HTMLElement>(`[data-id="${activeCategoryId}"]`)
            ?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }, [activeCategoryId]);

    return (
        <nav
            dir={isArabic ? "rtl" : "ltr"}
            lang={isArabic ? "ar" : "en"}
            aria-label={isArabic ? "تصنيفات المتجر" : "Store categories"}
            className="sticky top-0 z-50 flex h-11 items-stretch border-b border-white/15 bg-brand sm:h-[44px]"
        >
            <Link
                href={BACK_HREF}
                className={`${PIN_BTN} border-e border-white/15 px-3 sm:px-4`}
                aria-label={
                    isArabic ? "العودة إلى هايبر ماركت" : "Back to hypermarket"
                }
            >
                <BackIcon className="h-5 w-5 text-brand-foreground" strokeWidth={2} />
            </Link>

            <div
                ref={scrollRef}
                className="flex min-w-0 flex-1 items-center gap-3.5 overflow-x-auto overscroll-x-contain px-3 sm:gap-5 sm:px-5
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
                                // Active accent on brand bar — decorative lime kept as hex
                                active ? "text-[#9DFCA3]" : "text-brand-foreground/70 hover:text-brand-foreground/90",
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
                className={`${PIN_BTN} border-s border-white/15 px-3 sm:px-4`}
                aria-label={isArabic ? "عرض جميع الأقسام" : "View all categories"}
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

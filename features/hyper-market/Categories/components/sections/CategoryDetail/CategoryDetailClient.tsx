"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
    CategoryDetails,
    SubCategory,
} from "@/features/hyper-market/Categories/types/category-detail.types";
import { CategoryProductCard } from "./CategoryProductCard";

/**
 * Sticky offset layout:
 *
 *   0px   ─ top of viewport
 *  44px   ─ CategoryTabsClient (main green category nav)  [top-0 sticky]
 *  44px   ─ SubCategoryTabs (pill bar, this file)         [top-[44px] sticky]
 *  ─────
 *  88px   ─ STICKY_TOP used for scroll-to and rootMargin
 *
 * If your app has an additional header above CategoryTabsClient,
 * add its height to both CATEGORY_NAV_H and adjust top-0 → top-[Xpx].
 */
const CATEGORY_NAV_H = 44; // height of CategoryTabsClient
const SUB_NAV_H = 44;      // height of SubCategoryTabs (this file)
const SCROLL_OFFSET = CATEGORY_NAV_H + SUB_NAV_H + 8; // 8px breathing room

// ─── Sub-category pill bar ────────────────────────────────────────────────────

function SubCategoryTabs({
    subCategories,
    activeId,
    onSelect,
}: {
    subCategories: SubCategory[];
    activeId: number | null;
    onSelect: (id: number) => void;
}) {
    const barRef = useRef<HTMLDivElement>(null);

    // Keep active pill scrolled into view
    useEffect(() => {
        barRef.current
            ?.querySelector<HTMLElement>(`[data-sub-id="${activeId}"]`)
            ?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }, [activeId]);

    return (
        <div
            ref={barRef}
            dir="rtl"
            role="tablist"
            aria-label="أقسام فرعية"
            className="sticky z-20 flex gap- h-12 overflow-x-auto border-b border-gray-100 bg-white px-4 py-2 sm:px-5
                       scrollbar-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            style={{ top: CATEGORY_NAV_H }}
        >
            {subCategories.map((sc) => {
                const active = sc.id === activeId;
                return (
                    <button
                        key={sc.id}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        data-sub-id={sc.id}
                        onClick={() => onSelect(sc.id)}
                        className={[
                            "shrink-0 whitespace-nowrap rounded-[13.5px] px-4 py-2 text-xs font-semibold transition-colors",
                            active
                                ? "bg-[#EBFEEB] text-[#30913F]"
                                : "bg-[#F6F5F8] text-[#707784]",
                        ].join(" ")}
                    >
                        {sc.name}
                    </button>
                );
            })}
        </div>
    );
}

// ─── Sub-category section ─────────────────────────────────────────────────────

function SubCategorySection({
    subCategory,
    sectionRef,
    onLoadMore,
}: {
    subCategory: SubCategory;
    sectionRef: (el: HTMLElement | null) => void;
    onLoadMore: () => void;
}) {
    return (
        <section
            ref={sectionRef}
            data-subcategory-id={subCategory.id}
            aria-label={subCategory.name}
            className="pb-3"
        >
            {/* Section title */}
            <div className="bg-white px-4 py-3 sm:px-5">
                <h2 className="text-right text-base font-bold text-[#111B18]">
                    {subCategory.name}
                </h2>
            </div>

            {/* 3-column product grid */}
            <div className="grid grid-cols-3 gap-2 px-4 pt-2 sm:grid-cols-4 sm:px-5 md:grid-cols-5">
                {subCategory.products.map((product) => (
                    <CategoryProductCard key={product.id} product={product} />
                ))}
            </div>

            {subCategory.has_more && (
                <div className="flex justify-center pb-2 pt-3">
                    <button
                        type="button"
                        onClick={onLoadMore}
                        className="rounded-full border border-[#30913F] bg-white px-5 py-2 text-xs font-semibold text-[#30913F] transition-opacity active:opacity-70"
                    >
                        عرض المزيد
                    </button>
                </div>
            )}
        </section>
    );
}

// ─── Page controller ──────────────────────────────────────────────────────────

interface Props {
    detail: CategoryDetails;
}

export function CategoryDetailClient({ detail }: Props) {
    const [activeSubId, setActiveSubId] = useState<number | null>(
        detail.sub_categories[0]?.id ?? null
    );

    const sectionRefs = useRef<Map<number, HTMLElement>>(new Map());
    const isProgrammatic = useRef(false);

    // ── Scroll-spy ──
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (isProgrammatic.current) return;

                const best = entries
                    .filter((e) => e.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

                if (best) {
                    setActiveSubId(
                        Number((best.target as HTMLElement).dataset.subcategoryId)
                    );
                }
            },
            {
                threshold: [0, 0.25, 0.5, 0.75, 1],
                rootMargin: `-${SCROLL_OFFSET}px 0px -35% 0px`,
            }
        );

        sectionRefs.current.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, [detail]);

    // ── Register section DOM nodes ──
    const registerSection = useCallback((id: number, el: HTMLElement | null) => {
        if (el) sectionRefs.current.set(id, el);
        else sectionRefs.current.delete(id);
    }, []);

    // ── Pill tap → scroll to section ──
    const scrollToSection = useCallback((id: number) => {
        const el = sectionRefs.current.get(id);
        if (!el) return;

        isProgrammatic.current = true;
        setActiveSubId(id);

        const top = el.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET;
        window.scrollTo({ top, behavior: "smooth" });

        setTimeout(() => { isProgrammatic.current = false; }, 650);
    }, []);

    return (
        <div>
            {detail.sub_categories.length > 1 && (
                <SubCategoryTabs
                    subCategories={detail.sub_categories}
                    activeId={activeSubId}
                    onSelect={scrollToSection}
                />
            )}

            <div className="bg-[#F6F5F8] pb-8">
                {detail.sub_categories.map((sc) => (
                    <SubCategorySection
                        key={sc.id}
                        subCategory={sc}
                        sectionRef={(el) => registerSection(sc.id, el)}
                        onLoadMore={() => {/* hook into your loadMoreProducts here */ }}
                    />
                ))}
            </div>
        </div>
    );
}
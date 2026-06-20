"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
    CategoryDetails,
    SubCategory,
} from "@/features/hyper-market/Categories/types/category-detail.types";
import { CategoryProductCard } from "./CategoryProductCard";

const SCROLL_ROW =
    "flex gap-2 overflow-x-auto scroll-smooth snap-x scrollbar-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden";

function SubCategoryTabs({
    subCategories,
    activeId,
    onSelect,
}: {
    subCategories: SubCategory[];
    activeId: number | null;
    onSelect: (id: number) => void;
}) {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = scrollRef.current?.querySelector<HTMLElement>(`[data-sub-tab-id="${activeId}"]`);
        el?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }, [activeId]);

    return (
        <div
            ref={scrollRef}
            className={`sticky top-[101px] z-20 border-b border-gray-100 bg-white px-4 py-1 sm:px-5 ${SCROLL_ROW}`}
            dir="rtl"
        >
            {subCategories.map((sc) => {
                const isActive = sc.id === activeId;
                return (
                    <button
                        key={sc.id}
                        type="button"
                        data-sub-tab-id={sc.id}
                        onClick={() => onSelect(sc.id)}
                        className={[
                            "shrink-0 snap-start whitespace-nowrap rounded-[13.5px] px-4 py-2 text-xs font-semibold transition-colors",
                            isActive
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

function SubCategorySection({
    subCategory,
    sectionRef,
}: {
    subCategory: SubCategory;
    sectionRef: (el: HTMLElement | null) => void;
}) {
    return (
        <section
            ref={sectionRef}
            data-subcategory-id={subCategory.id}
            aria-label={subCategory.name}
            className="pb-3"
        >
            <div className="bg-white px-4 py-3 sm:px-5">
                <h2 className="text-right text-base font-bold text-[#111B18]">{subCategory.name}</h2>
            </div>

            <div className="grid grid-cols-3 gap-2 px-4 pt-2 sm:grid-cols-4 sm:px-5 md:grid-cols-5">
                {subCategory.products.map((product) => (
                    <CategoryProductCard key={product.id} product={product} />
                ))}
            </div>

            {subCategory.has_more && (
                <div className="flex justify-center pb-2 pt-3">
                    <button
                        type="button"
                        className="rounded-full border border-[#30913F] bg-white px-5 py-2 text-xs font-semibold text-[#30913F] transition-opacity active:opacity-70"
                    >
                        عرض المزيد
                    </button>
                </div>
            )}
        </section>
    );
}

interface CategoryDetailClientProps {
    detail: CategoryDetails;
}

export function CategoryDetailClient({ detail }: CategoryDetailClientProps) {
    const [activeSubId, setActiveSubId] = useState<number | null>(null);
    const sectionRefs = useRef<Map<number, HTMLElement>>(new Map());
    const isScrolling = useRef(false);

    useEffect(() => {
        if (detail.sub_categories.length) {
            setActiveSubId(detail.sub_categories[0].id);
        }
    }, [detail]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (isScrolling.current) return;

                const best = entries
                    .filter((e) => e.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

                if (best) {
                    setActiveSubId(Number((best.target as HTMLElement).dataset.subcategoryId));
                }
            },
            { threshold: [0, 0.25, 0.5, 0.75, 1], rootMargin: "-120px 0px -40% 0px" }
        );

        sectionRefs.current.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, [detail]);

    const handleSectionRef = useCallback((id: number, el: HTMLElement | null) => {
        if (el) sectionRefs.current.set(id, el);
        else sectionRefs.current.delete(id);
    }, []);

    const scrollToSubCategory = useCallback((id: number) => {
        const el = sectionRefs.current.get(id);
        if (!el) return;

        isScrolling.current = true;
        setActiveSubId(id);

        const top = el.getBoundingClientRect().top + window.scrollY - 140;
        window.scrollTo({ top, behavior: "smooth" });

        setTimeout(() => {
            isScrolling.current = false;
        }, 700);
    }, []);

    return (
        <div>
            {detail.sub_categories.length > 1 && (
                <SubCategoryTabs
                    subCategories={detail.sub_categories}
                    activeId={activeSubId}
                    onSelect={scrollToSubCategory}
                />
            )}

            <div className="bg-[#F6F5F8] pb-8">
                {detail.sub_categories.map((sc) => (
                    <SubCategorySection
                        key={sc.id}
                        subCategory={sc}
                        sectionRef={(el) => handleSectionRef(sc.id, el)}
                    />
                ))}
            </div>
        </div>
    );
}

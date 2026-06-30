"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { LayoutGrid, List, SlidersHorizontal } from "lucide-react";
import {
    CategoryDetails,
    SubCategory,
} from "@/features/hyper-market/Categories/types/category-detail.types";
import { CategoryProductCard } from "./CategoryProductCard";
import { FilterSheet, FilterValues } from "../../shared/FilterSheet";

type ViewMode = "grid" | "list";

// ── Sticky offset layout ───────────────────────────────────────────────────────
//   0px  — top of viewport
//  44px  — CategoryTabsClient (main green category nav)  [top-0 sticky]
//  44px  — SubCategoryTabs (pill bar, this file)         [top-[44px] sticky]
//  ────
//  88px  — SCROLL_OFFSET used for scroll-to and rootMargin
const CATEGORY_NAV_H = 44;
const SUB_NAV_H = 44;
const SCROLL_OFFSET = CATEGORY_NAV_H + SUB_NAV_H + 8;

// ── Toolbar button ─────────────────────────────────────────────────────────────

function ToolbarBtn({
    label,
    onClick,
    active = false,
    children,
}: {
    label: string;
    onClick: () => void;
    active?: boolean;
    children: React.ReactNode;
}) {
    return (
        <button
            type="button"
            aria-label={label}
            aria-pressed={active}
            onClick={onClick}
            className={[
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px]",
                "transition-colors active:scale-95",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2",
                active
                    ? "bg-[#30913F] text-white"
                    : "bg-[#EBFEEB] text-[#30913F]",
            ].join(" ")}
        >
            {children}
        </button>
    );
}

// ── Products toolbar ───────────────────────────────────────────────────────────

function ProductsToolbar({
    totalProducts,
    viewMode,
    onToggleView,
    onOpenFilter,
}: {
    totalProducts: number;
    viewMode: ViewMode;
    onToggleView: () => void;
    onOpenFilter: () => void;
}) {
    return (
        <div
            dir="ltr"
            className="flex items-center justify-between gap-3 bg-white px-4 py-2.5 sm:px-5"
        >
            <div className="flex items-center gap-2">
                <ToolbarBtn
                    label={viewMode === "grid" ? "عرض القائمة" : "عرض الشبكة"}
                    onClick={onToggleView}
                    active={viewMode === "list"}
                >
                    {viewMode === "grid"
                        ? <List className="h-[18px] w-[18px]" strokeWidth={2.25} />
                        : <LayoutGrid className="h-[18px] w-[18px]" strokeWidth={2.25} />
                    }
                </ToolbarBtn>

                <ToolbarBtn
                    label="تصفية المنتجات"
                    onClick={onOpenFilter}
                >
                    <SlidersHorizontal className="h-[18px] w-[18px]" strokeWidth={2.25} />
                </ToolbarBtn>
            </div>

            <p dir="rtl" className="text-sm font-medium text-[#707784]">
                <span className="tabular-nums">{totalProducts.toLocaleString("en-US")}</span>{" "}
                المنتجات
            </p>
        </div>
    );
}

// ── Sub-category pill bar ──────────────────────────────────────────────────────

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
            className="sticky z-20 flex h-12 gap-2 overflow-x-auto border-b border-gray-100 bg-white px-4 py-2 sm:px-5
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

// ── Sub-category section ───────────────────────────────────────────────────────

function SubCategorySection({
    subCategory,
    sectionRef,
    onLoadMore,
    viewMode,
    onToggleView,
    onOpenFilter,
}: {
    subCategory: SubCategory;
    sectionRef: (el: HTMLElement | null) => void;
    onLoadMore: () => void;
    viewMode: ViewMode;
    onToggleView: () => void;
    onOpenFilter: () => void;
}) {
    return (
        <section
            ref={sectionRef}
            data-subcategory-id={subCategory.id}
            aria-label={subCategory.name}
            className="pb-3"
        >
            <div className="bg-white px-4 pt-3 sm:px-5">
                <h2 className="text-right text-base font-bold text-[#111B18]">
                    {subCategory.name}
                </h2>
            </div>

            <ProductsToolbar
                totalProducts={subCategory.total_products}
                viewMode={viewMode}
                onToggleView={onToggleView}
                onOpenFilter={onOpenFilter}
            />

            {viewMode === "grid" ? (
                <div className="grid grid-cols-2 gap-2.5 px-4 pt-2 sm:grid-cols-3 sm:px-5">
                    {subCategory.products.map((product) => (
                        <CategoryProductCard key={product.id} product={product} layout="grid" />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col gap-2.5 px-4 pt-2 sm:px-5">
                    {subCategory.products.map((product) => (
                        <CategoryProductCard key={product.id} product={product} layout="list" />
                    ))}
                </div>
            )}

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

// ── Page controller ────────────────────────────────────────────────────────────

interface Props {
    detail: CategoryDetails;
}

export function CategoryDetailClient({ detail }: Props) {
    const [activeSubId, setActiveSubId] = useState<number | null>(
        detail.sub_categories[0]?.id ?? null
    );
    const [viewMode, setViewMode] = useState<ViewMode>("grid");
    const [filterOpen, setFilterOpen] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_filters, setFilters] = useState<FilterValues | null>(null);

    const sectionRefs = useRef<Map<number, HTMLElement>>(new Map());
    const isProgrammatic = useRef(false);

    const toggleView = useCallback(() => {
        setViewMode((prev) => (prev === "grid" ? "list" : "grid"));
    }, []);

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

    const registerSection = useCallback((id: number, el: HTMLElement | null) => {
        if (el) sectionRefs.current.set(id, el);
        else sectionRefs.current.delete(id);
    }, []);

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

            <div className="bg-[#F6F5F8] pb-28">
                {detail.sub_categories.map((sc) => (
                    <SubCategorySection
                        key={sc.id}
                        subCategory={sc}
                        sectionRef={(el) => registerSection(sc.id, el)}
                        onLoadMore={() => { /* hook into your loadMoreProducts here */ }}
                        viewMode={viewMode}
                        onToggleView={toggleView}
                        onOpenFilter={() => setFilterOpen(true)}
                    />
                ))}
            </div>

            <FilterSheet
                open={filterOpen}
                onClose={() => setFilterOpen(false)}
                onApply={(f) => {
                    setFilters(f);
                    setFilterOpen(false);
                }}
            />
        </div>
    );
}

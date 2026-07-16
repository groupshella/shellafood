"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { LayoutGrid, List, SlidersHorizontal } from "lucide-react";
import type {
    CategoryDetails,
    CategoryProduct,
    SubCategory,
} from "@/features/hyper-market/Categories/types/category-detail.types";
import { loadMoreSubCategoryProducts } from "@/features/hyper-market/Categories/components/shared/LoadMoreResult";
import {
    FilterSheet,
    type FilterValues,
    DEFAULT_FILTER_VALUES,
} from "../../shared/FilterSheet";
import { useNotification } from "@/shared/components/NotificationToast";
import { CategoryProductCard } from "./CategoryProductCard";

type ViewMode = "grid" | "list";

const CATEGORY_NAV_H = 44;
const SUB_NAV_H = 48;
const TOOLBAR_H = 52;
const LOAD_MORE_LIMIT = 20;

type SubCategoryState = {
    products: CategoryProduct[];
    totalProducts: number;
    hasMore: boolean;
    /** Last fetched page number (1-based) */
    page: number;
    isLoadingMore: boolean;
};

/** Scroll only the tab strip — avoids page jump from element.scrollIntoView. */
function scrollTabIntoView(container: HTMLElement, tab: HTMLElement) {
    const containerRect = container.getBoundingClientRect();
    const tabRect = tab.getBoundingClientRect();
    const delta =
        tabRect.left -
        containerRect.left -
        (container.clientWidth - tab.offsetWidth) / 2;
    container.scrollBy({ left: delta, behavior: "smooth" });
}

function getDisplayPrice(product: CategoryProduct): number {
    return product.discounted_price ?? product.price;
}

function applyFilterToProducts(
    products: CategoryProduct[],
    filter: FilterValues,
): CategoryProduct[] {
    let result = [...products];

    if (filter.price !== "all") {
        const [minStr, maxStr] = filter.price.split("-");
        const min = Number(minStr);
        const max = Number(maxStr);
        const [lo, hi] = min <= max ? [min, max] : [max, min];
        result = result.filter((p) => {
            const price = getDisplayPrice(p);
            return price >= lo && price <= hi;
        });
    }

    if (filter.sort === "price-asc") {
        result.sort((a, b) => getDisplayPrice(a) - getDisplayPrice(b));
    } else if (filter.sort === "price-desc") {
        result.sort((a, b) => getDisplayPrice(b) - getDisplayPrice(a));
    }

    return result;
}

function isDefaultFilter(f: FilterValues) {
    return f.sort === "popular" && f.price === "all";
}

function buildInitialState(
    subCategories: SubCategory[],
): Record<number, SubCategoryState> {
    return Object.fromEntries(
        subCategories.map((sc) => [
            sc.id,
            {
                products: sc.products,
                totalProducts: sc.total_products,
                hasMore: sc.has_more,
                page: 1,
                isLoadingMore: false,
            } satisfies SubCategoryState,
        ]),
    );
}

function mergeProducts(
    existing: CategoryProduct[],
    incoming: CategoryProduct[],
): CategoryProduct[] {
    const seen = new Set(existing.map((p) => p.id));
    const appended = incoming.filter((p) => !seen.has(p.id));
    return appended.length === 0 ? existing : [...existing, ...appended];
}

function ToolbarBtn({
    label,
    onClick,
    active = false,
    indicator = false,
    children,
}: {
    label: string;
    onClick: () => void;
    active?: boolean;
    indicator?: boolean;
    children: React.ReactNode;
}) {
    return (
        <button
            type="button"
            aria-label={label}
            aria-pressed={active}
            onClick={onClick}
            className={[
                "relative flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px]",
                "transition-colors active:scale-95",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                active
                    ? "bg-brand text-brand-foreground"
                    : "bg-brand/10 text-brand",
            ].join(" ")}
        >
            {children}
            {indicator && (
                <span className="absolute -end-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-brand ring-2 ring-background" />
            )}
        </button>
    );
}

function ProductsToolbar({
    totalProducts,
    viewMode,
    hasActiveFilter,
    stickyTop,
    isArabic,
    onToggleView,
    onOpenFilter,
}: {
    totalProducts: number;
    viewMode: ViewMode;
    hasActiveFilter: boolean;
    stickyTop: number;
    isArabic: boolean;
    onToggleView: () => void;
    onOpenFilter: () => void;
}) {
    return (
        <div
            className="sticky z-20 flex items-center justify-between gap-3 border-b border-border bg-background px-3 py-2.5 sm:px-5 lg:px-6"
            style={{ top: stickyTop }}
        >
            <div className="flex items-center gap-2">
                <ToolbarBtn
                    label={
                        viewMode === "grid"
                            ? isArabic
                                ? "عرض القائمة"
                                : "List view"
                            : isArabic
                              ? "عرض الشبكة"
                              : "Grid view"
                    }
                    onClick={onToggleView}
                    active={viewMode === "list"}
                >
                    {viewMode === "grid" ? (
                        <List className="h-[18px] w-[18px]" strokeWidth={2.25} />
                    ) : (
                        <LayoutGrid className="h-[18px] w-[18px]" strokeWidth={2.25} />
                    )}
                </ToolbarBtn>

                <ToolbarBtn
                    label={isArabic ? "تصفية المنتجات" : "Filter products"}
                    onClick={onOpenFilter}
                    indicator={hasActiveFilter}
                >
                    <SlidersHorizontal className="h-[18px] w-[18px]" strokeWidth={2.25} />
                </ToolbarBtn>
            </div>

            <p className="text-sm font-medium text-muted">
                <span className="tabular-nums">
                    {totalProducts.toLocaleString("en-US")}
                </span>{" "}
                {isArabic ? "منتج" : "products"}
            </p>
        </div>
    );
}

function SubCategoryTabs({
    subCategories,
    activeId,
    isArabic,
    onSelect,
}: {
    subCategories: SubCategory[];
    activeId: number | null;
    isArabic: boolean;
    onSelect: (id: number) => void;
}) {
    const barRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = barRef.current;
        if (!container || activeId == null) return;

        const tab = container.querySelector<HTMLElement>(
            `[data-sub-id="${activeId}"]`,
        );
        if (!tab) return;

        const frame = requestAnimationFrame(() =>
            scrollTabIntoView(container, tab),
        );
        return () => cancelAnimationFrame(frame);
    }, [activeId]);

    return (
        <div
            ref={barRef}
            dir={isArabic ? "rtl" : "ltr"}
            role="tablist"
            aria-label={isArabic ? "أقسام فرعية" : "Subcategories"}
            className="sticky z-30 flex h-12 gap-2 overflow-x-auto overscroll-x-contain border-b border-border bg-background px-3 py-2 sm:px-5 lg:px-6 scrollbar-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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
                            "shrink-0 whitespace-nowrap rounded-[13.5px] px-4 py-2 text-xs font-semibold transition-colors sm:text-[13px]",
                            active
                                ? "bg-brand/10 text-brand"
                                : "bg-card text-muted",
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
    displayProducts,
    sectionRef,
    viewMode,
    isArabic,
}: {
    subCategory: SubCategory;
    displayProducts: CategoryProduct[];
    sectionRef: (el: HTMLElement | null) => void;
    onLoadMore: () => void;
    canLoadMore: boolean;
    isLoadingMore: boolean;
    viewMode: ViewMode;
    isArabic: boolean;
}) {
    return (
        <section
            ref={sectionRef}
            data-subcategory-id={subCategory.id}
            aria-label={subCategory.name}
            className="pb-3"
        >
            <div className="bg-background px-3 pt-3 sm:px-5 lg:px-6">
                <h2 className="text-start text-base font-bold text-foreground sm:text-lg">
                    {subCategory.name}
                </h2>
            </div>

            {displayProducts.length === 0 ? (
                <p className="px-3 py-8 text-center text-sm text-muted">
                    {isArabic
                        ? "لا توجد منتجات تطابق الفلتر الحالي"
                        : "No products match the current filter"}
                </p>
            ) : viewMode === "grid" ? (
                <div className="grid grid-cols-2 gap-2 px-3 pt-2 sm:grid-cols-3 sm:gap-2.5 sm:px-5 md:grid-cols-3 lg:grid-cols-4 lg:gap-3 lg:px-6 xl:grid-cols-5">
                    {displayProducts.map((product) => (
                        <CategoryProductCard
                            key={product.id}
                            product={product}
                            layout="grid"
                            isArabic={isArabic}
                        />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-2.5 px-3 pt-2 sm:px-5 md:grid-cols-2 md:gap-3 lg:px-6">
                    {displayProducts.map((product) => (
                        <CategoryProductCard
                            key={product.id}
                            product={product}
                            layout="list"
                            isArabic={isArabic}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}

interface Props {
    detail: CategoryDetails;
    storeId: string;
    isArabic: boolean;
}

export function CategoryDetailClient({ detail, storeId, isArabic }: Props) {
    const { error: notifyError } = useNotification();
    const hasSubTabs = detail.sub_categories.length > 1;
    const scrollOffset =
        CATEGORY_NAV_H + (hasSubTabs ? SUB_NAV_H : 0) + TOOLBAR_H + 8;
    const toolbarStickyTop = CATEGORY_NAV_H + (hasSubTabs ? SUB_NAV_H : 0);

    const [activeSubId, setActiveSubId] = useState<number | null>(
        detail.sub_categories[0]?.id ?? null,
    );
    const [viewMode, setViewMode] = useState<ViewMode>("grid");
    const [filterOpen, setFilterOpen] = useState(false);
    const [filter, setFilter] = useState<FilterValues>(DEFAULT_FILTER_VALUES);
    const [subCategoriesState, setSubCategoriesState] = useState(() =>
        buildInitialState(detail.sub_categories),
    );

    const stateRef = useRef(subCategoriesState);
    const sectionRefs = useRef<Map<number, HTMLElement>>(new Map());
    const observerRef = useRef<IntersectionObserver | null>(null);
    const isProgrammatic = useRef(false);
    const loadingIdsRef = useRef<Set<number>>(new Set());

    // Reset pagination when navigating to another category (or after HMR
    // leaves stale state that still uses the old item-based `offset` field).
    useEffect(() => {
        const next = buildInitialState(detail.sub_categories);
        setSubCategoriesState(next);
        stateRef.current = next;
        loadingIdsRef.current.clear();
        setActiveSubId(detail.sub_categories[0]?.id ?? null);
        // Only reset when the category itself changes — not on every RSC payload.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [detail.category_id]);

    useEffect(() => {
        stateRef.current = subCategoriesState;
    }, [subCategoriesState]);

    const toggleView = useCallback(() => {
        setViewMode((prev) => (prev === "grid" ? "list" : "grid"));
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (isProgrammatic.current) return;

                const best = entries
                    .filter((e) => e.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

                if (!best) return;

                const nextId = Number(
                    (best.target as HTMLElement).dataset.subcategoryId,
                );
                if (!Number.isFinite(nextId)) return;

                setActiveSubId((prev) => (prev === nextId ? prev : nextId));
            },
            {
                threshold: [0, 0.15, 0.35, 0.55, 0.75],
                rootMargin: `-${scrollOffset}px 0px -40% 0px`,
            },
        );

        observerRef.current = observer;
        sectionRefs.current.forEach((el) => observer.observe(el));

        return () => {
            observer.disconnect();
            observerRef.current = null;
        };
    }, [detail.category_id, scrollOffset]);

    const registerSection = useCallback((id: number, el: HTMLElement | null) => {
        const prev = sectionRefs.current.get(id);
        if (prev && prev !== el) {
            observerRef.current?.unobserve(prev);
            sectionRefs.current.delete(id);
        }

        if (el) {
            sectionRefs.current.set(id, el);
            observerRef.current?.observe(el);
        }
    }, []);

    const scrollToSection = useCallback(
        (id: number) => {
            const el = sectionRefs.current.get(id);
            if (!el) return;

            isProgrammatic.current = true;
            setActiveSubId(id);

            const top =
                el.getBoundingClientRect().top + window.scrollY - scrollOffset;
            window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });

            const clearFlag = () => {
                isProgrammatic.current = false;
                window.removeEventListener("scrollend", clearFlag);
            };

            if ("onscrollend" in window) {
                window.addEventListener("scrollend", clearFlag, { once: true });
            } else {
                setTimeout(clearFlag, 700);
            }
        },
        [scrollOffset],
    );

    const handleLoadMore = useCallback(
        async (subCategoryId: number) => {
            if (loadingIdsRef.current.has(subCategoryId)) return;

            const current = stateRef.current[subCategoryId];
            if (!current || current.isLoadingMore || !current.hasMore) return;

            // Coerce: HMR / stale state may still have old `offset` and no `page`.
            const currentPage = Math.max(
                1,
                Number(current.page) ||
                Number((current as { offset?: number }).offset) ||
                1,
            );
            // If legacy state stored item-count in `offset` (e.g. 50), treat as page 1.
            const safePage = currentPage > 100 ? 1 : currentPage;
            const nextPage = safePage + 1;

            loadingIdsRef.current.add(subCategoryId);

            setSubCategoriesState((prev) => ({
                ...prev,
                [subCategoryId]: {
                    ...prev[subCategoryId],
                    page: safePage,
                    isLoadingMore: true,
                },
            }));

            try {
                const result = await loadMoreSubCategoryProducts({
                    storeId,
                    subCategoryId,
                    limit: LOAD_MORE_LIMIT,
                    offset: nextPage,
                });

                if (!result.success) {
                    notifyError(result.message);
                    setSubCategoriesState((prev) => ({
                        ...prev,
                        [subCategoryId]: {
                            ...prev[subCategoryId],
                            isLoadingMore: false,
                        },
                    }));
                    return;
                }

                const { products: pageProducts, total_products, has_more } =
                    result.subCategory;

                setSubCategoriesState((prev) => {
                    const entry = prev[subCategoryId];
                    if (!entry) return prev;

                    const products = mergeProducts(entry.products, pageProducts);

                    return {
                        ...prev,
                        [subCategoryId]: {
                            products,
                            totalProducts: total_products,
                            hasMore: has_more && pageProducts.length > 0,
                            page: nextPage,
                            isLoadingMore: false,
                        },
                    };
                });
            } finally {
                loadingIdsRef.current.delete(subCategoryId);
            }
        },
        [storeId, notifyError],
    );

    const hasActiveFilter = !isDefaultFilter(filter);

    const sections = detail.sub_categories.map((sc) => {
        const state = subCategoriesState[sc.id];
        const displayProducts = applyFilterToProducts(
            state?.products ?? sc.products,
            filter,
        );
        return { sc, state, displayProducts };
    });

    const visibleProductCount = sections.reduce(
        (sum, s) => sum + s.displayProducts.length,
        0,
    );

    return (
        <div dir={isArabic ? "rtl" : "ltr"} lang={isArabic ? "ar" : "en"}>
            {hasSubTabs && (
                <SubCategoryTabs
                    subCategories={detail.sub_categories}
                    activeId={activeSubId}
                    isArabic={isArabic}
                    onSelect={scrollToSection}
                />
            )}

            <ProductsToolbar
                totalProducts={visibleProductCount}
                viewMode={viewMode}
                hasActiveFilter={hasActiveFilter}
                stickyTop={toolbarStickyTop}
                isArabic={isArabic}
                onToggleView={toggleView}
                onOpenFilter={() => setFilterOpen(true)}
            />

            <div className="pb-28">
                {sections.map(({ sc, state, displayProducts }) => (
                    <SubCategorySection
                        key={sc.id}
                        subCategory={sc}
                        displayProducts={displayProducts}
                        sectionRef={(el) => registerSection(sc.id, el)}
                        onLoadMore={() => handleLoadMore(sc.id)}
                        canLoadMore={Boolean(state?.hasMore) && !hasActiveFilter}
                        isLoadingMore={Boolean(state?.isLoadingMore)}
                        viewMode={viewMode}
                        isArabic={isArabic}
                    />
                ))}
            </div>

            <FilterSheet
                open={filterOpen}
                onClose={() => setFilterOpen(false)}
                initialValues={filter}
                isArabic={isArabic}
                onApply={(next) => {
                    setFilter(next);
                    setFilterOpen(false);
                }}
            />
        </div>
    );
}

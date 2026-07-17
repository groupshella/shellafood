"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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

function GridViewIcon({ className }: { className?: string }) {
    return (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            aria-hidden
        >
            <path
                d="M15 22.75H9C3.57 22.75 1.25 20.43 1.25 15V9C1.25 3.57 3.57 1.25 9 1.25H15C20.43 1.25 22.75 3.57 22.75 9V15C22.75 20.43 20.43 22.75 15 22.75ZM9 2.75C4.39 2.75 2.75 4.39 2.75 9V15C2.75 19.61 4.39 21.25 9 21.25H15C19.61 21.25 21.25 19.61 21.25 15V9C21.25 4.39 19.61 2.75 15 2.75H9Z"
                fill="currentColor"
            />
            <path
                d="M12 22.75C11.59 22.75 11.25 22.41 11.25 22V2C11.25 1.59 11.59 1.25 12 1.25C12.41 1.25 12.75 1.59 12.75 2V22C12.75 22.41 12.41 22.75 12 22.75Z"
                fill="currentColor"
            />
            <path
                d="M22 12.75H2C1.59 12.75 1.25 12.41 1.25 12C1.25 11.59 1.59 11.25 2 11.25H22C22.41 11.25 22.75 11.59 22.75 12C22.75 12.41 22.41 12.75 22 12.75Z"
                fill="currentColor"
            />
        </svg>
    );
}

function ListViewIcon({ className }: { className?: string }) {
    return (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            aria-hidden
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M4.28571 15.4286C4.62671 15.4286 4.95373 15.5641 5.19485 15.8052C5.43597 16.0463 5.57143 16.3733 5.57143 16.7143C5.57143 17.0553 5.43597 17.3823 5.19485 17.6235C4.95373 17.8646 4.62671 18 4.28571 18C3.94472 18 3.6177 17.8646 3.37658 17.6235C3.13546 17.3823 3 17.0553 3 16.7143C3 16.3733 3.13546 16.0463 3.37658 15.8052C3.6177 15.5641 3.94472 15.4286 4.28571 15.4286ZM19.7134 15.8572C20.1874 15.8572 20.5714 16.2377 20.5714 16.7143C20.5714 17.1879 20.19 17.5715 19.7134 17.5715H7.71514C7.60245 17.5718 7.49079 17.5499 7.3866 17.5069C7.2824 17.464 7.18772 17.4009 7.10799 17.3212C7.02826 17.2416 6.96506 17.147 6.92201 17.0428C6.87896 16.9386 6.85692 16.827 6.85714 16.7143C6.85714 16.2407 7.23857 15.8572 7.71514 15.8572H19.7134ZM4.28571 11.1429C4.62671 11.1429 4.95373 11.2784 5.19485 11.5195C5.43597 11.7606 5.57143 12.0876 5.57143 12.4286C5.57143 12.7696 5.43597 13.0966 5.19485 13.3377C4.95373 13.5789 4.62671 13.7143 4.28571 13.7143C3.94472 13.7143 3.6177 13.5789 3.37658 13.3377C3.13546 13.0966 3 12.7696 3 12.4286C3 12.0876 3.13546 11.7606 3.37658 11.5195C3.6177 11.2784 3.94472 11.1429 4.28571 11.1429ZM19.7134 11.5715C20.1874 11.5715 20.5714 11.952 20.5714 12.4286C20.5714 12.9022 20.19 13.2857 19.7134 13.2857H7.71514C7.60245 13.2861 7.49079 13.2642 7.3866 13.2212C7.2824 13.1783 7.18772 13.1152 7.10799 13.0355C7.02826 12.9559 6.96506 12.8612 6.92201 12.7571C6.87896 12.6529 6.85692 12.5413 6.85714 12.4286C6.85714 11.955 7.23857 11.5715 7.71514 11.5715H19.7134ZM4.28571 6.85718C4.62671 6.85718 4.95373 6.99264 5.19485 7.23375C5.43597 7.47487 5.57143 7.8019 5.57143 8.14289C5.57143 8.48388 5.43597 8.81091 5.19485 9.05203C4.95373 9.29315 4.62671 9.42861 4.28571 9.42861C3.94472 9.42861 3.6177 9.29315 3.37658 9.05203C3.13546 8.81091 3 8.48388 3 8.14289C3 7.8019 3.13546 7.47487 3.37658 7.23375C3.6177 6.99264 3.94472 6.85718 4.28571 6.85718ZM19.7134 7.28575C20.1874 7.28575 20.5714 7.66632 20.5714 8.14289C20.5714 8.61646 20.19 9.00003 19.7134 9.00003H7.71514C7.60245 9.00037 7.49079 8.97844 7.3866 8.9355C7.2824 8.89255 7.18772 8.82944 7.10799 8.74979C7.02826 8.67014 6.96506 8.57552 6.92201 8.47137C6.87896 8.36722 6.85692 8.25559 6.85714 8.14289C6.85714 7.66932 7.23857 7.28575 7.71514 7.28575H19.7134Z"
                fill="currentColor"
            />
        </svg>
    );
}

function FilterIcon({ className }: { className?: string }) {
    return (
        <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            aria-hidden
        >
            <rect width="32" height="32" rx="4" fill="#EBFEEB" />
            <path
                d="M26 21.5H19"
                stroke="#30913F"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M9 21.5H6"
                stroke="#30913F"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M26 10.5H23"
                stroke="#30913F"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M13 10.5H6"
                stroke="#30913F"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M11 18.5H17C18.1 18.5 19 19 19 20.5V22.5C19 24 18.1 24.5 17 24.5H11C9.9 24.5 9 24 9 22.5V20.5C9 19 9.9 18.5 11 18.5Z"
                stroke="#30913F"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M15 7.5H21C22.1 7.5 23 8 23 9.5V11.5C23 13 22.1 13.5 21 13.5H15C13.9 13.5 13 13 13 11.5V9.5C13 8 13.9 7.5 15 7.5Z"
                stroke="#30913F"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

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
    bare = false,
    children,
}: {
    label: string;
    onClick: () => void;
    active?: boolean;
    indicator?: boolean;
    /** When true, skip the soft/solid brand chip — icon brings its own background. */
    bare?: boolean;
    children: React.ReactNode;
}) {
    return (
        <button
            type="button"
            aria-label={label}
            aria-pressed={active}
            onClick={onClick}
            className={[
                "relative flex shrink-0 items-center justify-center transition-colors active:scale-95",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                bare
                    ? "h-8 w-8 rounded sm:h-9 sm:w-9 md:h-10 md:w-10 lg:h-11 lg:w-11"
                    : [
                          "h-9 w-9 rounded-[10px] sm:h-10 sm:w-10 sm:rounded-xl md:h-11 md:w-11 lg:h-12 lg:w-12",
                          active
                              ? "bg-brand text-brand-foreground"
                              : "bg-brand/10 text-brand",
                      ].join(" "),
            ].join(" ")}
        >
            {children}
            {indicator && (
                <span className="absolute -end-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-brand ring-2 ring-background sm:h-3 sm:w-3" />
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
            className="sticky z-20 flex items-center justify-between gap-3 border-b border-border bg-background px-3 py-2.5 sm:px-5 sm:py-3 md:py-3.5 lg:px-6"
            style={{ top: stickyTop }}
        >
            <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3">
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
                        <ListViewIcon className="h-[18px] w-[18px] sm:h-5 sm:w-5 md:h-6 md:w-6 lg:h-7 lg:w-7" />
                    ) : (
                        <GridViewIcon className="h-[18px] w-[18px] sm:h-5 sm:w-5 md:h-6 md:w-6 lg:h-7 lg:w-7" />
                    )}
                </ToolbarBtn>

                <ToolbarBtn
                    label={isArabic ? "تصفية المنتجات" : "Filter products"}
                    onClick={onOpenFilter}
                    indicator={hasActiveFilter}
                    bare
                >
                    <FilterIcon className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 lg:h-11 lg:w-11" />
                </ToolbarBtn>
            </div>

            <p className="text-sm font-medium text-muted sm:text-[15px] md:text-base">
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

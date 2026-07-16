"use client";

import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import {
    List,
    LayoutGrid,
    TrendingUp,
    TrendingDown,
    Search,
    X,
} from "lucide-react";
import type { OfferItem } from "@/features/offers/types/offer.types";
import type { CategoryProduct } from "@/features/hyper-market/Categories/types/category-detail.types";
import { useOfferSearch } from "@/features/offers/hooks/useOfferSearch";
import { CategoryProductCard } from "@/features/hyper-market/Categories/components/sections/CategoryDetail/CategoryProductCard";
import { Empty } from "./Empty";
import { OfferItemsSearchLoading } from "./skeleton";

type ViewMode = "grid" | "list";
type PriceSort = "none" | "asc" | "desc";

const SECTION_PADDING = "px-3 sm:px-4 md:px-5 lg:px-6";

const TOOLBAR_ICON_BTN = [
    "flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px]",
    "transition-colors active:scale-95",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "sm:h-9 sm:w-9",
].join(" ");

const TOOLBAR_ICON_IDLE = "bg-brand/10 text-brand active:bg-brand/20";

const TOOLBAR_ICON_ACTIVE = "bg-brand text-brand-foreground";

const GRID_LAYOUT =
    "grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-2.5 md:grid-cols-3 lg:grid-cols-4 lg:gap-3 xl:grid-cols-5";

const LIST_LAYOUT =
    "grid grid-cols-1 gap-2.5 md:grid-cols-2 md:gap-3";

function toCategoryProduct(item: OfferItem): CategoryProduct {
    return {
        id: item.id,
        name: item.name,
        full_image_url: item.image_full_url,
        price: item.price,
        discounted_price: item.discounted_price,
        discount_percentage: item.discount_percentage,
    };
}

function effectivePrice(item: OfferItem): number {
    if (item.discounted_price > 0 && item.discounted_price < item.price) {
        return item.discounted_price;
    }
    return item.price;
}

function sortByPrice(items: OfferItem[], sort: PriceSort): OfferItem[] {
    if (sort === "none") return items;

    const sorted = [...items];
    sorted.sort((a, b) => {
        const diff = effectivePrice(a) - effectivePrice(b);
        return sort === "asc" ? diff : -diff;
    });
    return sorted;
}

interface ToolbarProps {
    total: number;
    viewMode: ViewMode;
    priceSort: PriceSort;
    onToggleView: () => void;
    onToggleSort: () => void;
    onSearchOpen: () => void;
    isArabic: boolean;
}

function ProductsToolbar({
    total,
    viewMode,
    priceSort,
    onToggleView,
    onToggleSort,
    onSearchOpen,
    isArabic,
}: ToolbarProps) {
    return (
        <div
            dir="ltr"
            className={`flex items-center justify-between gap-3 bg-background py-2.5 sm:py-3 ${SECTION_PADDING}`}
        >
            <div className="flex items-center gap-2 sm:gap-2.5">
                <button
                    type="button"
                    onClick={onToggleView}
                    className={`${TOOLBAR_ICON_BTN} ${viewMode === "list" ? TOOLBAR_ICON_ACTIVE : TOOLBAR_ICON_IDLE}`}
                    aria-label={
                        viewMode === "grid"
                            ? isArabic
                                ? "عرض القائمة"
                                : "List view"
                            : isArabic
                              ? "عرض الشبكة"
                              : "Grid view"
                    }
                    aria-pressed={viewMode === "list"}
                >
                    {viewMode === "grid" ? (
                        <List
                            className="h-[18px] w-[18px] sm:h-4 sm:w-4"
                            strokeWidth={2.25}
                            aria-hidden
                        />
                    ) : (
                        <LayoutGrid
                            className="h-[18px] w-[18px] sm:h-4 sm:w-4"
                            strokeWidth={2.25}
                            aria-hidden
                        />
                    )}
                </button>

                <button
                    type="button"
                    onClick={onToggleSort}
                    className={`${TOOLBAR_ICON_BTN} ${priceSort !== "none" ? TOOLBAR_ICON_ACTIVE : TOOLBAR_ICON_IDLE}`}
                    aria-label={
                        priceSort === "asc"
                            ? isArabic
                                ? "ترتيب من الأعلى للأقل"
                                : "Sort high to low"
                            : priceSort === "desc"
                              ? isArabic
                                  ? "إلغاء الترتيب"
                                  : "Clear sort"
                              : isArabic
                                ? "ترتيب حسب السعر"
                                : "Sort by price"
                    }
                    aria-pressed={priceSort !== "none"}
                >
                    {priceSort === "desc" ? (
                        <TrendingDown
                            className="h-[18px] w-[18px] sm:h-4 sm:w-4"
                            strokeWidth={2.25}
                            aria-hidden
                        />
                    ) : (
                        <TrendingUp
                            className="h-[18px] w-[18px] sm:h-4 sm:w-4"
                            strokeWidth={2.25}
                            aria-hidden
                        />
                    )}
                </button>

                <button
                    type="button"
                    onClick={onSearchOpen}
                    className={`${TOOLBAR_ICON_BTN} ${TOOLBAR_ICON_IDLE}`}
                    aria-label={isArabic ? "البحث في المنتجات" : "Search products"}
                >
                    <Search
                        className="h-[18px] w-[18px] sm:h-4 sm:w-4"
                        strokeWidth={2.25}
                        aria-hidden
                    />
                </button>
            </div>

            <p
                dir={isArabic ? "rtl" : "ltr"}
                className="text-sm font-medium text-muted sm:text-[15px]"
            >
                <span className="tabular-nums">{total.toLocaleString("en-US")}</span>
                {isArabic ? " منتج" : " products"}
            </p>
        </div>
    );
}

interface SearchBarProps {
    value: string;
    onChange: (v: string) => void;
    onClose: () => void;
    isArabic: boolean;
}

function SearchBar({ value, onChange, onClose, isArabic }: SearchBarProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    return (
        <div
            dir={isArabic ? "rtl" : "ltr"}
            lang={isArabic ? "ar" : "en"}
            role="search"
            className={`flex animate-[slideDown_200ms_ease-out] items-center gap-2 bg-background py-2.5 sm:gap-2.5 sm:py-3 ${SECTION_PADDING}`}
        >
            <div className="relative min-w-0 flex-1">
                <Search
                    className="absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted sm:h-[18px] sm:w-[18px]"
                    strokeWidth={2}
                    aria-hidden
                />
                <input
                    ref={inputRef}
                    type="search"
                    dir={isArabic ? "rtl" : "ltr"}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={isArabic ? "ابحث في المنتجات..." : "Search products..."}
                    aria-label={isArabic ? "البحث في المنتجات" : "Search products"}
                    className={[
                        "w-full rounded-xl bg-card py-3 pe-10 ps-4 text-sm text-foreground placeholder:text-muted",
                        "focus:outline-none focus:ring-2 focus:ring-brand",
                        "sm:py-2.5 sm:text-[13px]",
                        "[&::-webkit-search-cancel-button]:appearance-none",
                        "[&::-webkit-search-decoration]:appearance-none",
                    ].join(" ")}
                />
            </div>

            <button
                type="button"
                onClick={onClose}
                aria-label={isArabic ? "إغلاق البحث" : "Close search"}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-card text-foreground transition-colors active:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:h-9 sm:w-9"
            >
                <X
                    className="h-[18px] w-[18px] sm:h-4 sm:w-4"
                    strokeWidth={2.25}
                    aria-hidden
                />
            </button>
        </div>
    );
}

interface OfferItemsClientProps {
    items: OfferItem[];
    total: number;
    offerId: string;
    moduleId: string;
    hasMore: boolean;
    initialOffset: number;
    pageLimit: number;
    isArabic: boolean;
}

export function OfferItemsClient({
    items,
    total,
    offerId,
    moduleId,
    hasMore,
    initialOffset,
    pageLimit,
    isArabic,
}: OfferItemsClientProps) {
    const [searchOpen, setSearchOpen] = useState(false);
    const [viewMode, setViewMode] = useState<ViewMode>("grid");
    const [priceSort, setPriceSort] = useState<PriceSort>("none");
    const [displayItems, setDisplayItems] = useState<OfferItem[]>(items);
    const [displayTotal, setDisplayTotal] = useState(total);
    const [hasMorePages, setHasMorePages] = useState(hasMore);
    const [loadingMore, setLoadingMore] = useState(false);
    const [loadMoreError, setLoadMoreError] = useState<string | null>(null);
    const nextPageRef = useRef(initialOffset + 1);

    const lang = isArabic ? "ar" : "en";
    const search = useOfferSearch(offerId, moduleId, lang, isArabic);

    const isSearchActive = search.query.trim().length > 0;
    const baseItems = search.results ?? displayItems;
    const visibleItems = useMemo(
        () => sortByPrice(baseItems, priceSort),
        [baseItems, priceSort],
    );
    const visibleTotal = search.total ?? displayTotal;

    const toggleView = useCallback(() => {
        setViewMode((prev) => (prev === "grid" ? "list" : "grid"));
    }, []);

    const toggleSort = useCallback(() => {
        setPriceSort((prev) => {
            if (prev === "none") return "asc";
            if (prev === "asc") return "desc";
            return "none";
        });
    }, []);

    const openSearch = useCallback(() => {
        setSearchOpen(true);
    }, []);

    const closeSearch = useCallback(() => {
        search.clearSearch();
        setSearchOpen(false);
    }, [search]);

    const loadMore = useCallback(async () => {
        if (loadingMore || !hasMorePages || isSearchActive) return;

        setLoadingMore(true);
        setLoadMoreError(null);

        try {
            const res = await fetch(
                `/api/offers/${offerId}/items?offset=${nextPageRef.current}&limit=${pageLimit}&module_id=${moduleId}&lang=${lang}`
            );
            const json = await res.json();
            if (!json.success) throw new Error(json.message);

            const { items: nextItems, hasMore: more } = json.data;
            setDisplayItems((prev) => [...prev, ...nextItems]);
            nextPageRef.current += 1;
            setHasMorePages(more);
        } catch {
            setLoadMoreError(
                isArabic
                    ? "حدث خطأ أثناء تحميل المزيد"
                    : "Something went wrong while loading more"
            );
        } finally {
            setLoadingMore(false);
        }
    }, [
        loadingMore,
        hasMorePages,
        isSearchActive,
        offerId,
        pageLimit,
        moduleId,
        lang,
        isArabic,
    ]);

    return (
        <section
            aria-label={isArabic ? "منتجات العرض" : "Offer products"}
            className="bg-background pb-[calc(7rem+env(safe-area-inset-bottom))]"
            dir={isArabic ? "rtl" : "ltr"}
            lang={isArabic ? "ar" : "en"}
        >
            {searchOpen ? (
                <SearchBar
                    value={search.query}
                    onChange={search.setQuery}
                    onClose={closeSearch}
                    isArabic={isArabic}
                />
            ) : (
                <ProductsToolbar
                    total={visibleTotal}
                    viewMode={viewMode}
                    priceSort={priceSort}
                    onToggleView={toggleView}
                    onToggleSort={toggleSort}
                    onSearchOpen={openSearch}
                    isArabic={isArabic}
                />
            )}

            {(search.error ?? loadMoreError) && (
                <p
                    role="alert"
                    className={`py-2 text-center text-[13px] font-medium text-red-600 sm:text-sm ${SECTION_PADDING}`}
                >
                    {search.error ?? loadMoreError}
                </p>
            )}

            {search.loading ? (
                <OfferItemsSearchLoading isArabic={isArabic} />
            ) : visibleItems.length === 0 ? (
                <Empty isSearch={isSearchActive} isArabic={isArabic} />
            ) : (
                <div className={`pt-2 sm:pt-3 ${SECTION_PADDING}`}>
                    <div className={viewMode === "grid" ? GRID_LAYOUT : LIST_LAYOUT}>
                        {visibleItems.map((item) => (
                            <CategoryProductCard
                                key={item.id}
                                product={toCategoryProduct(item)}
                                layout={viewMode}
                                moduleId={moduleId}
                                isArabic={isArabic}
                            />
                        ))}
                    </div>
                </div>
            )}

            {hasMorePages && !isSearchActive && !search.loading && visibleItems.length > 0 && (
                <div className={`pt-4 sm:pt-5 ${SECTION_PADDING}`}>
                    <button
                        type="button"
                        onClick={loadMore}
                        disabled={loadingMore}
                        className="w-full rounded-xl bg-card py-3 text-sm font-semibold text-brand shadow-[0_2px_8px_rgba(0,0,0,0.07)] transition-colors hover:brightness-95 active:brightness-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-60 sm:mx-auto sm:block sm:max-w-md sm:text-[14px] md:max-w-lg lg:py-3.5 lg:text-[15px]"
                    >
                        {loadingMore
                            ? isArabic
                                ? "جارٍ التحميل…"
                                : "Loading…"
                            : isArabic
                              ? "تحميل المزيد"
                              : "Load more"}
                    </button>
                </div>
            )}
        </section>
    );
}

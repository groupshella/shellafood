"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import {
    List,
    TrendingUp,
    Search,
    X,
} from "lucide-react";
import type { OfferItem } from "@/features/offers/types/offer.types";
import { useOfferSearch } from "@/features/offers/hooks/useOfferSearch";
import { ProductCard } from "./ProductCard";
import { Empty } from "./Empty";
import { OfferItemsSearchLoading } from "./skeleton";

const SECTION_PADDING = "px-3 sm:px-4 md:px-5 lg:px-6";

const TOOLBAR_ICON_BTN = [
    "flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px]",
    "bg-[#EBFEEB] text-[#30913F] dark:bg-[#0d2e12] dark:text-[#4db860]",
    "transition-colors active:bg-[#DCF5DC] dark:active:bg-[#163d1c]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-950",
    "sm:h-9 sm:w-9",
].join(" ");

const PRODUCT_GRID =
    "grid grid-cols-1 gap-2 sm:gap-2.5 md:grid-cols-2 md:gap-3 lg:gap-4";

interface ToolbarProps {
    total: number;
    onSearchOpen: () => void;
}

function ProductsToolbar({ total, onSearchOpen }: ToolbarProps) {
    return (
        <div
            dir="ltr"
            className={`flex items-center justify-between gap-3 bg-white py-2.5 dark:bg-gray-900 sm:py-3 ${SECTION_PADDING}`}
        >
            <div className="flex items-center gap-2 sm:gap-2.5">
                <button type="button" className={TOOLBAR_ICON_BTN} aria-label="عرض القائمة">
                    <List
                        className="h-[18px] w-[18px] sm:h-4 sm:w-4"
                        strokeWidth={2.25}
                        aria-hidden
                    />
                </button>

                <button type="button" className={TOOLBAR_ICON_BTN} aria-label="ترتيب المنتجات">
                    <TrendingUp
                        className="h-[18px] w-[18px] sm:h-4 sm:w-4"
                        strokeWidth={2.25}
                        aria-hidden
                    />
                </button>

                <button
                    type="button"
                    onClick={onSearchOpen}
                    className={TOOLBAR_ICON_BTN}
                    aria-label="البحث في المنتجات"
                >
                    <Search
                        className="h-[18px] w-[18px] sm:h-4 sm:w-4"
                        strokeWidth={2.25}
                        aria-hidden
                    />
                </button>
            </div>

            <p dir="rtl" className="text-sm font-medium text-gray-500 dark:text-gray-400 sm:text-[15px]">
                <span className="tabular-nums">{total.toLocaleString("en-US")}</span>{" "}
                منتجات
            </p>
        </div>
    );
}

interface SearchBarProps {
    value: string;
    onChange: (v: string) => void;
    onClose: () => void;
}

function SearchBar({ value, onChange, onClose }: SearchBarProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    return (
        <div
            dir="rtl"
            role="search"
            className={`flex animate-[slideDown_200ms_ease-out] items-center gap-2 bg-white py-2.5 dark:bg-gray-900 sm:gap-2.5 sm:py-3 ${SECTION_PADDING}`}
        >
            <div className="relative min-w-0 flex-1">
                <Search
                    className="absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500 sm:h-[18px] sm:w-[18px]"
                    strokeWidth={2}
                    aria-hidden
                />
                <input
                    ref={inputRef}
                    type="search"
                    dir="rtl"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="ابحث في المنتجات..."
                    aria-label="البحث في المنتجات"
                    className={[
                        "w-full rounded-xl bg-gray-100 py-3 pe-10 ps-4 text-sm text-gray-700 placeholder:text-gray-400",
                        "focus:outline-none focus:ring-2 focus:ring-[#30913F]",
                        "dark:bg-gray-800 dark:text-gray-200 dark:placeholder:text-gray-500",
                        "sm:py-2.5 sm:text-[13px]",
                        "[&::-webkit-search-cancel-button]:appearance-none",
                        "[&::-webkit-search-decoration]:appearance-none",
                    ].join(" ")}
                />
            </div>

            <button
                type="button"
                onClick={onClose}
                aria-label="إغلاق البحث"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-gray-100 text-gray-600 transition-colors active:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2 dark:bg-gray-800 dark:text-gray-300 dark:active:bg-gray-700 dark:focus-visible:ring-offset-gray-950 sm:h-9 sm:w-9"
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
}

export function OfferItemsClient({
    items,
    total,
    offerId,
    moduleId,
    hasMore,
    initialOffset,
    pageLimit,
}: OfferItemsClientProps) {
    const [searchOpen, setSearchOpen] = useState(false);
    const [displayItems, setDisplayItems] = useState<OfferItem[]>(items);
    const [displayTotal, setDisplayTotal] = useState(total);
    const [hasMorePages, setHasMorePages] = useState(hasMore);
    const [loadingMore, setLoadingMore] = useState(false);
    const [loadMoreError, setLoadMoreError] = useState<string | null>(null);
    const nextPageRef = useRef(initialOffset + 1);

    const search = useOfferSearch(offerId, moduleId);

    const isSearchActive = search.query.trim().length > 0;
    const visibleItems = search.results ?? displayItems;
    const visibleTotal = search.total ?? displayTotal;

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
                `/api/offers/${offerId}/items?offset=${nextPageRef.current}&limit=${pageLimit}&module_id=${moduleId}`
            );
            const json = await res.json();
            if (!json.success) throw new Error(json.message);

            const { items: nextItems, hasMore: more } = json.data;
            setDisplayItems((prev) => [...prev, ...nextItems]);
            nextPageRef.current += 1;
            setHasMorePages(more);
        } catch {
            setLoadMoreError("حدث خطأ أثناء تحميل المزيد");
        } finally {
            setLoadingMore(false);
        }
    }, [loadingMore, hasMorePages, isSearchActive, offerId, pageLimit, moduleId]);

    return (
        <section
            aria-label="منتجات العرض"
            className="bg-[#F6F5F8] pb-[calc(7rem+env(safe-area-inset-bottom))] dark:bg-gray-950"
        >
            {searchOpen ? (
                <SearchBar
                    value={search.query}
                    onChange={search.setQuery}
                    onClose={closeSearch}
                />
            ) : (
                <ProductsToolbar total={visibleTotal} onSearchOpen={openSearch} />
            )}

            {(search.error ?? loadMoreError) && (
                <p
                    role="alert"
                    className={`py-2 text-center text-[13px] font-medium text-red-600 dark:text-red-400 sm:text-sm ${SECTION_PADDING}`}
                >
                    {search.error ?? loadMoreError}
                </p>
            )}

            {search.loading ? (
                <OfferItemsSearchLoading />
            ) : visibleItems.length === 0 ? (
                <Empty isSearch={isSearchActive} />
            ) : (
                <div className={`pt-2 sm:pt-3 ${SECTION_PADDING}`}>
                    <div className={PRODUCT_GRID}>
                        {visibleItems.map((item) => (
                            <ProductCard key={item.id} item={item} moduleId={moduleId} />
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
                        className="w-full rounded-xl bg-white py-3 text-sm font-semibold text-[#30913F] shadow-[0_2px_8px_rgba(0,0,0,0.07)] transition-colors active:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2 disabled:opacity-60 dark:bg-gray-800 dark:text-[#4db860] dark:active:bg-gray-700 dark:focus-visible:ring-offset-gray-950 sm:mx-auto sm:block sm:max-w-md sm:text-[14px] md:max-w-lg lg:py-3.5 lg:text-[15px]"
                    >
                        {loadingMore ? "جارٍ التحميل…" : "تحميل المزيد"}
                    </button>
                </div>
            )}
        </section>
    );
}

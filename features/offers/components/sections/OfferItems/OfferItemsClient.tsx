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

const TOOLBAR_ICON_BTN = [
    "flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[#EBFEEB] text-[#30913F]",
    "transition-colors active:bg-[#DCF5DC]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2",
].join(" ");

interface ToolbarProps {
    total: number;
    onSearchOpen: () => void;
}

function ProductsToolbar({ total, onSearchOpen }: ToolbarProps) {
    return (
        <div
            dir="ltr"
            className="flex items-center justify-between gap-3 bg-white px-4 py-2.5 sm:px-5"
        >
            <div className="flex items-center gap-2">
                <button type="button" className={TOOLBAR_ICON_BTN} aria-label="عرض القائمة">
                    <List className="h-[18px] w-[18px]" strokeWidth={2.25} />
                </button>

                <button type="button" className={TOOLBAR_ICON_BTN} aria-label="ترتيب المنتجات">
                    <TrendingUp className="h-[18px] w-[18px]" strokeWidth={2.25} />
                </button>

                <button
                    type="button"
                    onClick={onSearchOpen}
                    className={TOOLBAR_ICON_BTN}
                    aria-label="البحث في المنتجات"
                >
                    <Search className="h-[18px] w-[18px]" strokeWidth={2.25} />
                </button>
            </div>

            <p dir="rtl" className="text-sm font-medium text-[#707784]">
                <span className="tabular-nums">{total.toLocaleString("ar-SA")}</span>{" "}
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
            className="flex animate-[slideDown_200ms_ease-out] items-center gap-2 bg-white px-4 py-2.5"
        >
            <div className="relative flex-1">
                <Search
                    className="absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
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
                    className="w-full rounded-xl bg-[#F6F5F8] py-2.5 pe-9 ps-4 text-[13px] text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#30913F]"
                />
            </div>

            <button
                type="button"
                onClick={onClose}
                aria-label="إغلاق البحث"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[#F6F5F8] text-gray-600 transition-colors active:bg-gray-200"
            >
                <X className="h-[18px] w-[18px]" strokeWidth={2.25} />
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
        <section aria-label="منتجات العرض" className="bg-[#F6F5F8] pb-28">
            {searchOpen ? (
                <SearchBar
                    value={search.query}
                    onChange={search.setQuery}
                    onClose={closeSearch}
                />
            ) : (
                <ProductsToolbar total={visibleTotal} onSearchOpen={() => setSearchOpen(true)} />
            )}

            {search.loading && (
                <p className="px-4 py-2 text-center text-[13px] text-gray-400">
                    جارٍ البحث…
                </p>
            )}

            {(search.error ?? loadMoreError) && (
                <p className="px-4 py-2 text-center text-[13px] text-red-500">
                    {search.error ?? loadMoreError}
                </p>
            )}

            {!search.loading && visibleItems.length === 0 ? (
                <Empty isSearch={isSearchActive} />
            ) : (
                <div className="flex flex-col gap-2 px-4 pt-2">
                    {visibleItems.map((item) => (
                        <ProductCard key={item.id} item={item} moduleId={moduleId} />
                    ))}
                </div>
            )}

            {hasMorePages && !isSearchActive && !search.loading && visibleItems.length > 0 && (
                <div className="px-4 pt-4">
                    <button
                        type="button"
                        onClick={loadMore}
                        disabled={loadingMore}
                        className="w-full rounded-xl bg-white py-3 text-[14px] font-semibold text-[#30913F] shadow-[0_2px_8px_rgba(0,0,0,0.07)] transition-colors active:bg-gray-50 disabled:opacity-60"
                    >
                        {loadingMore ? "جارٍ التحميل…" : "تحميل المزيد"}
                    </button>
                </div>
            )}
        </section>
    );
}

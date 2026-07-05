"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import {
    List,
    TrendingUp,
    SlidersHorizontal,
    Search,
    X,
    ShoppingBag,
} from "lucide-react";
import type { BrandItem } from "@/features/hyper-market/Brands/types/brands.types";
import { useBrandSearch } from "@/features/hyper-market/Brands/hooks/useBrandSearch";
import { useBrandFilter } from "@/features/hyper-market/Brands/hooks/useBrandFilter";
import { FilterSheet } from "@/features/hyper-market/Brands/components/shared/FilterSheet";
import { BrandItemCard } from "./BrandItemCard";
import { BrandItemsListLoading } from "./skeleton";

/* ── Shared icon-button class ──────────────────────────────────────── */

const TOOLBAR_ICON_BTN = [
    "flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[#EBFEEB] text-[#30913F]",
    "transition-colors active:bg-[#DCF5DC]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2",
].join(" ");

/* ── Toolbar ────────────────────────────────────────────────────────── */

interface ToolbarProps {
    items: BrandItem[];
    hasActiveFilter: boolean;
    onFilterClick: () => void;
    onSearchOpen: () => void;
}

function ProductsToolbar({
    items,
    hasActiveFilter,
    onFilterClick,
    onSearchOpen,
}: ToolbarProps) {
    return (
        <div
            dir="ltr"
            className="flex items-center justify-between gap-3 bg-white px-4 py-2.5 sm:px-5"
        >
            {/* Left group: action icon buttons */}
            <div className="flex items-center gap-2">


                {/* Filter button with active-indicator dot */}
                <div className="relative">
                    <button
                        type="button"
                        onClick={onFilterClick}
                        className={TOOLBAR_ICON_BTN}
                        aria-label="تصفية المنتجات"
                    >
                        <SlidersHorizontal className="h-[18px] w-[18px]" strokeWidth={2.25} />
                    </button>
                    {hasActiveFilter && (
                        <span
                            aria-hidden
                            className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-[#30913F] ring-2 ring-white"
                        />
                    )}
                </div>

                {/* Search open */}
                <button
                    type="button"
                    onClick={onSearchOpen}
                    className={TOOLBAR_ICON_BTN}
                    aria-label="البحث في المنتجات"
                >
                    <Search className="h-[18px] w-[18px]" strokeWidth={2.25} />
                </button>
            </div>

            {/* Right: product count */}
            <p dir="rtl" className="text-sm font-medium text-[#707784]">
                <span className="tabular-nums">{items.length.toLocaleString("en-US")}</span>{" "}
                منتج
            </p>
        </div>
    );
}

/* ── Animated search bar (replaces toolbar row) ─────────────────────── */

interface SearchBarProps {
    value: string;
    onChange: (v: string) => void;
    onClose: () => void;
}

function SearchBar({ value, onChange, onClose }: SearchBarProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    // Auto-focus when bar mounts
    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    return (
        <div
            dir="rtl"
            className="flex animate-[slideDown_200ms_ease-out] items-center gap-2 bg-white px-4 py-2.5"
        >
            {/* Text input */}
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
                    className={[
                        "w-full rounded-xl bg-[#F6F5F8] py-2.5 pe-9 ps-4 text-[13px] text-gray-700 placeholder:text-gray-400",
                        "focus:outline-none focus:ring-2 focus:ring-[#30913F]",
                        "[&::-webkit-search-cancel-button]:appearance-none",
                        "[&::-webkit-search-decoration]:appearance-none",
                    ].join(" ")}
                />
            </div>

            {/* Close / cancel */}
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

/* ── Empty state ────────────────────────────────────────────────────── */

type EmptyMode = "search" | "filter" | "none";

function EmptyState({
    mode,
    onClearSearch,
    onClearFilters,
}: {
    mode: EmptyMode;
    onClearSearch: () => void;
    onClearFilters: () => void;
}) {
    const title =
        mode === "search"
            ? "لا توجد نتائج"
            : mode === "filter"
                ? "لا توجد منتجات بهذا الفلتر"
                : "لا توجد منتجات حالياً";

    const description =
        mode === "search"
            ? "جرّب كلمة بحث مختلفة"
            : mode === "filter"
                ? "جرّب تعديل الفلاتر أو إزالتها"
                : "جرّب لاحقاً أو غيّر الفلاتر إن كانت مطبّقة";

    return (
        <div className="flex flex-col items-center justify-center py-20 text-center" dir="rtl">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                <ShoppingBag className="h-8 w-8 text-gray-300" strokeWidth={1.4} />
            </div>

            <p className="text-[15px] font-semibold text-gray-700">{title}</p>
            <p className="mt-1 text-[13px] text-gray-400">{description}</p>

            {mode === "search" && (
                <button
                    type="button"
                    onClick={onClearSearch}
                    className="mt-4 rounded-xl border border-[#30913F]/30 bg-white px-4 py-2 text-[13px] font-semibold text-[#30913F] transition-colors active:bg-[#EBFEEB]"
                >
                    مسح البحث
                </button>
            )}

            {mode === "filter" && (
                <button
                    type="button"
                    onClick={onClearFilters}
                    className="mt-4 rounded-xl border border-[#30913F]/30 bg-white px-4 py-2 text-[13px] font-semibold text-[#30913F] transition-colors active:bg-[#EBFEEB]"
                >
                    إزالة الفلاتر
                </button>
            )}
        </div>
    );
}

/* ── Main client component ──────────────────────────────────────────── */

interface BrandItemsClientProps {
    items: BrandItem[];
    total: number;
    brandId: string;
}

export function BrandItemsClient({ items, total, brandId }: BrandItemsClientProps) {
    /* Search mode toggle */
    const [searchOpen, setSearchOpen] = useState(false);


    const [filterSheetOpen, setFilterSheetOpen] = useState(false);
    const [filterSheetVisible, setFilterSheetVisible] = useState(false);
    /* Hooks */
    const search = useBrandSearch(brandId);
    const filter = useBrandFilter(brandId);

    /* Priority: search results > filter results > original server items */
    const displayItems: BrandItem[] = search.results ?? filter.results ?? items;


    const isSearchActive = search.query.trim().length > 0;
    const isFilterActive = filter.applied !== null;

    /* Filter sheet open/close with animation */
    const openFilterSheet = useCallback(() => {
        setFilterSheetOpen(true);
        requestAnimationFrame(() => {
            requestAnimationFrame(() => setFilterSheetVisible(true));
        });
    }, []);

    const closeFilterSheet = useCallback(() => {
        setFilterSheetVisible(false);
        setTimeout(() => setFilterSheetOpen(false), 350);
    }, []);

    /* Close search and clear results */
    const closeSearch = useCallback(() => {
        search.clearSearch();
        setSearchOpen(false);
    }, [search]);

    return (
        <section aria-label="منتجات البراند" className="bg-[#F6F5F8] pb-28">

            {/* ── Toolbar OR Search bar ── */}
            {searchOpen ? (
                <SearchBar
                    value={search.query}
                    onChange={search.setQuery}
                    onClose={closeSearch}
                />
            ) : (
                <ProductsToolbar
                    items={displayItems}
                    hasActiveFilter={isFilterActive}
                    onFilterClick={openFilterSheet}
                    onSearchOpen={() => setSearchOpen(true)}
                />
            )}

            {/* ── Error ── */}
            {(search.error ?? filter.error) && (
                <p className="px-4 py-2 text-center text-[13px] text-red-500">
                    {search.error ?? filter.error}
                </p>
            )}

            {/* ── Active filter badge (shown below toolbar when filter applied) ── */}
            {isFilterActive && filter.applied?.priceRange && (
                <div
                    dir="rtl"
                    className="flex items-center gap-2 bg-white px-4 py-2"
                >
                    <span className="text-[12px] text-gray-500">فلتر السعر:</span>
                    <span className="rounded-full bg-[#EBFEEB] px-3 py-0.5 text-[12px] font-medium text-[#30913F]">
                        {filter.applied.priceRange.label}
                    </span>
                    <button
                        type="button"
                        onClick={filter.clearFilters}
                        aria-label="إزالة الفلتر"
                        className="ms-auto text-[12px] text-gray-400 underline-offset-2 hover:underline"
                    >
                        إزالة
                    </button>
                </div>
            )}

            {/* ── Search / filter loading ── */}
            {search.loading || filter.loading ? (
                <BrandItemsListLoading />
            ) : displayItems.length === 0 ? (
                <EmptyState
                    mode={isSearchActive ? "search" : isFilterActive ? "filter" : "none"}
                    onClearSearch={closeSearch}
                    onClearFilters={filter.clearFilters}
                />
            ) : (
                <div className="flex flex-col divide-y divide-gray-100 bg-white">
                    {displayItems.map((item) => (
                        <BrandItemCard key={item.id} item={item} />
                    ))}
                </div>
            )}

            {/* ── Filter bottom sheet ── */}
            <FilterSheet
                isOpen={filterSheetOpen}
                isVisible={filterSheetVisible}
                onClose={closeFilterSheet}
                applied={filter.applied}
                onApply={(f) => {
                    filter.applyFilters(f);
                    closeFilterSheet();
                }}
                onClear={() => {
                    filter.clearFilters();
                    closeFilterSheet();
                }}
            />
        </section>
    );
}
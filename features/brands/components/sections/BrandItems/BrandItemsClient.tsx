"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import {
    SlidersHorizontal,
    Search,
    X,
    ShoppingBag,
} from "lucide-react";
import type { BrandItem } from "@/features/brands/types/brands.types";
import { useBrandSearch } from "@/features/brands/hooks/useBrandSearch";
import { useBrandFilter } from "@/features/brands/hooks/useBrandFilter";
import { FilterSheet } from "@/features/brands/components/shared/FilterSheet";
import { BrandItemCard } from "./BrandItemCard";
import { BrandItemsListLoading } from "./skeleton";

const TOOLBAR_ICON_BTN = [
    "flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px]",
    "bg-brand/10 text-brand",
    "transition-colors active:bg-brand/20",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background",
].join(" ");

interface ToolbarProps {
    items: BrandItem[];
    hasActiveFilter: boolean;
    onFilterClick: () => void;
    onSearchOpen: () => void;
    isArabic: boolean;
}

function ProductsToolbar({
    items,
    hasActiveFilter,
    onFilterClick,
    onSearchOpen,
    isArabic,
}: ToolbarProps) {
    return (
        <div
            dir="ltr"
            className="flex items-center justify-between gap-3 bg-background px-3 py-2.5 sm:px-5 lg:px-6"
        >
            <div className="flex items-center gap-2">
                <div className="relative">
                    <button
                        type="button"
                        onClick={onFilterClick}
                        className={TOOLBAR_ICON_BTN}
                        aria-label={isArabic ? "تصفية المنتجات" : "Filter products"}
                    >
                        <SlidersHorizontal className="h-[18px] w-[18px]" strokeWidth={2.25} />
                    </button>
                    {hasActiveFilter && (
                        <span
                            aria-hidden
                            className="absolute -end-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-brand ring-2 ring-background"
                        />
                    )}
                </div>

                <button
                    type="button"
                    onClick={onSearchOpen}
                    className={TOOLBAR_ICON_BTN}
                    aria-label={isArabic ? "البحث في المنتجات" : "Search products"}
                >
                    <Search className="h-[18px] w-[18px]" strokeWidth={2.25} />
                </button>
            </div>

            <p
                dir={isArabic ? "rtl" : "ltr"}
                className="text-sm font-medium text-muted"
            >
                <span className="tabular-nums">{items.length.toLocaleString("en-US")}</span>
                {isArabic ? " منتج" : " products"}
            </p>
        </div>
    );
}

interface SearchBarProps {
    value: string;
    onChange: (v: string) => void;
    onSubmit: () => void;
    onClose: () => void;
    isArabic: boolean;
}

function SearchBar({ value, onChange, onSubmit, onClose, isArabic }: SearchBarProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    return (
        <form
            dir={isArabic ? "rtl" : "ltr"}
            lang={isArabic ? "ar" : "en"}
            role="search"
            onSubmit={(e) => { e.preventDefault(); onSubmit(); }}
            className="flex animate-[slideDown_200ms_ease-out] items-center gap-2 bg-background px-3 py-2.5 sm:px-5 lg:px-6"
        >
            <div className="relative flex-1">
                <input
                    ref={inputRef}
                    type="search"
                    dir={isArabic ? "rtl" : "ltr"}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={isArabic ? "ابحث في المنتجات..." : "Search products..."}
                    enterKeyHint="search"
                    className={[
                        "w-full rounded-xl bg-card py-2.5 pe-4 ps-4 text-[13px] text-foreground placeholder:text-muted",
                        "focus:outline-none focus:ring-2 focus:ring-brand",
                        "[&::-webkit-search-cancel-button]:appearance-none",
                        "[&::-webkit-search-decoration]:appearance-none",
                    ].join(" ")}
                />
            </div>

            <button
                type="submit"
                aria-label={isArabic ? "بحث" : "Search"}
                disabled={!value.trim()}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-brand text-brand-foreground transition-colors hover:brightness-95 active:brightness-90 disabled:opacity-40"
            >
                <Search className="h-4 w-4" strokeWidth={2} aria-hidden />
            </button>

            <button
                type="button"
                onClick={onClose}
                aria-label={isArabic ? "إغلاق البحث" : "Close search"}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-card text-foreground transition-colors active:brightness-95"
            >
                <X className="h-[18px] w-[18px]" strokeWidth={2.25} />
            </button>
        </form>
    );
}

type EmptyMode = "search" | "filter" | "none";

function EmptyState({
    mode,
    onClearSearch,
    onClearFilters,
    isArabic,
}: {
    mode: EmptyMode;
    onClearSearch: () => void;
    onClearFilters: () => void;
    isArabic: boolean;
}) {
    const title =
        mode === "search"
            ? isArabic
                ? "لا توجد نتائج"
                : "No results"
            : mode === "filter"
                ? isArabic
                    ? "لا توجد منتجات بهذا الفلتر"
                    : "No products match this filter"
                : isArabic
                    ? "لا توجد منتجات حالياً"
                    : "No products right now";

    const description =
        mode === "search"
            ? isArabic
                ? "جرّب كلمة بحث مختلفة"
                : "Try a different search term"
            : mode === "filter"
                ? isArabic
                    ? "جرّب تعديل الفلاتر أو إزالتها"
                    : "Try adjusting or clearing filters"
                : isArabic
                    ? "جرّب لاحقاً أو غيّر الفلاتر إن كانت مطبّقة"
                    : "Try again later or change applied filters";

    return (
        <div
            className="flex flex-col items-center justify-center px-4 py-20 text-center"
            dir={isArabic ? "rtl" : "ltr"}
            lang={isArabic ? "ar" : "en"}
        >
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-card">
                <ShoppingBag className="h-8 w-8 text-muted" strokeWidth={1.4} />
            </div>

            <p className="text-[15px] font-semibold text-foreground">{title}</p>
            <p className="mt-1 text-[13px] text-muted">{description}</p>

            {mode === "search" && (
                <button
                    type="button"
                    onClick={onClearSearch}
                    className="mt-4 rounded-xl border border-brand/30 bg-background px-4 py-2 text-[13px] font-semibold text-brand transition-colors active:bg-brand/10"
                >
                    {isArabic ? "مسح البحث" : "Clear search"}
                </button>
            )}

            {mode === "filter" && (
                <button
                    type="button"
                    onClick={onClearFilters}
                    className="mt-4 rounded-xl border border-brand/30 bg-background px-4 py-2 text-[13px] font-semibold text-brand transition-colors active:bg-brand/10"
                >
                    {isArabic ? "إزالة الفلاتر" : "Clear filters"}
                </button>
            )}
        </div>
    );
}

interface BrandItemsClientProps {
    items: BrandItem[];
    total: number;
    brandId: string;
    isArabic: boolean;
}

export function BrandItemsClient({
    items,
    brandId,
    isArabic,
}: BrandItemsClientProps) {
    const [searchOpen, setSearchOpen] = useState(false);
    const [filterSheetOpen, setFilterSheetOpen] = useState(false);
    const [filterSheetVisible, setFilterSheetVisible] = useState(false);

    const lang = isArabic ? "ar" : "en";
    const search = useBrandSearch(brandId, lang, isArabic);
    const filter = useBrandFilter(brandId, lang, isArabic);

    const displayItems: BrandItem[] = search.results ?? filter.results ?? items;

    const isSearchActive = search.query.trim().length > 0;
    const isFilterActive = filter.applied !== null;

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

    const closeSearch = useCallback(() => {
        search.clearSearch();
        setSearchOpen(false);
    }, [search]);

    return (
        <section
            aria-label={isArabic ? "منتجات البراند" : "Brand products"}
            className="bg-background pb-[calc(7rem+env(safe-area-inset-bottom))]"
            dir={isArabic ? "rtl" : "ltr"}
            lang={isArabic ? "ar" : "en"}
        >

            {searchOpen ? (
                <SearchBar
                    value={search.query}
                    onChange={search.setQuery}
                    onSubmit={search.submitSearch}
                    onClose={closeSearch}
                    isArabic={isArabic}
                />
            ) : (
                <ProductsToolbar
                    items={displayItems}
                    hasActiveFilter={isFilterActive}
                    onFilterClick={openFilterSheet}
                    onSearchOpen={() => setSearchOpen(true)}
                    isArabic={isArabic}
                />
            )}

            {(search.error ?? filter.error) && (
                <p className="px-4 py-2 text-center text-[13px] text-red-500" role="alert">
                    {search.error ?? filter.error}
                </p>
            )}

            {isFilterActive && filter.applied?.priceRange && (
                <div
                    dir={isArabic ? "rtl" : "ltr"}
                    className="flex items-center gap-2 bg-background px-4 py-2 sm:px-5"
                >
                    <span className="text-[12px] text-muted">
                        {isArabic ? "فلتر السعر:" : "Price filter:"}
                    </span>
                    <span className="rounded-full bg-brand/10 px-3 py-0.5 text-[12px] font-medium text-brand">
                        {filter.applied.priceRange.label}
                    </span>
                    <button
                        type="button"
                        onClick={filter.clearFilters}
                        aria-label={isArabic ? "إزالة الفلتر" : "Remove filter"}
                        className="ms-auto text-[12px] text-muted underline-offset-2 hover:underline"
                    >
                        {isArabic ? "إزالة" : "Remove"}
                    </button>
                </div>
            )}

            {search.loading || filter.loading ? (
                <BrandItemsListLoading isArabic={isArabic} />
            ) : displayItems.length === 0 ? (
                <EmptyState
                    mode={isSearchActive ? "search" : isFilterActive ? "filter" : "none"}
                    onClearSearch={closeSearch}
                    onClearFilters={filter.clearFilters}
                    isArabic={isArabic}
                />
            ) : (
                <div className="flex flex-col divide-y divide-border bg-background md:grid md:grid-cols-2 md:gap-2.5 md:divide-y-0 md:bg-transparent md:px-5 md:pt-2.5 lg:grid-cols-3 lg:gap-3 lg:px-6">
                    {displayItems.map((item) => (
                        <BrandItemCard key={item.id} item={item} isArabic={isArabic} />
                    ))}
                </div>
            )}

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
                isArabic={isArabic}
            />
        </section>
    );
}

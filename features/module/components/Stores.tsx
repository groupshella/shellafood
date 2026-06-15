"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Truck, Clock, SlidersHorizontal, X, Check, ChevronDown } from "lucide-react";
import { useStores } from "@/features/module/hooks/useStores";
import { useCategories } from "@/features/module/hooks/useCategories";
import { Store, StoreFilters, DEFAULT_FILTERS, hasActiveFilters, countActiveChipFilters } from "@/features/module/types/stores.types";

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDistance(meters: number): string {
    if (meters < 1000) return `${Math.round(meters)} م`;
    return `${(meters / 1000).toFixed(1)} كم`;
}

function storeSubtitle(store: Store): string {
    if (store.delivery_time) return `توصيل خلال ${store.delivery_time}`;
    if (store.distance > 0) return `يبعد ${formatDistance(store.distance)}`;
    return "متجر متاح للطلب";
}

// ── Store Card (List layout matching design image) ────────────────────────────

function StoreCard({ store }: { store: Store }) {
    const [logoError, setLogoError] = useState(false);

    return (
        <Link
            href={`/store/${store.id}?module_id=${store.module_id}`}
            className={[
                "group flex items-center gap-3 rounded-2xl bg-white p-3",
                "shadow-[0_2px_12px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.04]",
                "transition-transform duration-150 active:scale-[0.985]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2",
            ].join(" ")}
            dir="rtl"
            aria-label={store.name}
        >
            {/* Logo */}
            <div className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-xl bg-gray-100 ring-1 ring-black/[0.05]">
                {!logoError && store.logo_full_url ? (
                    <Image
                        src={store.logo_full_url}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="72px"
                        loading="lazy"
                        onError={() => setLogoError(true)}
                    />
                ) : (
                    <div className="h-full w-full bg-[#4ADE80]" />
                )}
            </div>

            {/* Info */}
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                {/* Name + open badge */}
                <div className="flex items-center justify-between gap-2">
                    <h3 className="truncate text-sm font-bold text-gray-900">{store.name}</h3>
                    <span
                        className={[
                            "shrink-0 rounded-md px-2 py-0.5 text-[11px] font-semibold",
                            store.is_open
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-500",
                        ].join(" ")}
                    >
                        {store.is_open ? "مفتوح" : "مغلق"}
                    </span>
                </div>

                {/* Rating + delivery */}
                <div className="flex items-center gap-3 text-xs text-gray-500">
                    {store.avg_rating > 0 && (
                        <span className="inline-flex items-center gap-1 font-semibold text-gray-800">
                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" strokeWidth={0} />
                            {store.avg_rating.toFixed(1)}
                        </span>
                    )}
                    <span className="inline-flex items-center gap-1">
                        <Clock className="h-3 w-3 shrink-0" />
                        {storeSubtitle(store)}
                    </span>
                </div>

                {/* Tags row */}
                <div className="flex flex-wrap items-center gap-1.5">
                    {store.free_delivery && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-[#E8F5E9] px-2 py-0.5 text-[11px] font-medium text-green-700">
                            <Truck className="h-3 w-3" strokeWidth={2} />
                            توصيل مجاني
                        </span>
                    )}
                    {store.has_offer && (
                        <span className="rounded-md bg-purple-50 px-2 py-0.5 text-[11px] font-medium text-purple-700">
                            عرض
                        </span>
                    )}
                </div>
            </div>

            {/* Chevron */}
            <ChevronDown className="h-4 w-4 shrink-0 -rotate-90 text-gray-300 transition-transform group-hover:-translate-x-0.5" strokeWidth={2} />
        </Link>
    );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function StoresSkeleton() {
    return (
        <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
                <div
                    key={i}
                    className="flex items-center gap-3 rounded-2xl bg-white p-3 ring-1 ring-black/[0.04]"
                >
                    <div className="h-[72px] w-[72px] shrink-0 animate-pulse rounded-xl bg-gray-100" />
                    <div className="flex-1 space-y-2">
                        <div className="h-4 w-2/3 animate-pulse rounded bg-gray-100" />
                        <div className="h-3 w-1/2 animate-pulse rounded bg-gray-100" />
                        <div className="h-3 w-1/3 animate-pulse rounded bg-gray-100" />
                    </div>
                </div>
            ))}
        </div>
    );
}

// ── Chip Filter Button ────────────────────────────────────────────────────────

interface ChipProps {
    label: string;
    active: boolean;
    onClick: () => void;
}

function FilterChip({ label, active, onClick }: ChipProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={[
                "inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5",
                "text-xs font-semibold transition-all duration-150",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F]/40",
                active
                    ? "bg-[#30913F] text-white shadow-sm"
                    : "bg-white text-gray-700 ring-1 ring-gray-200 hover:ring-[#30913F]/40",
            ].join(" ")}
            aria-pressed={active}
        >
            {active && <Check className="h-3 w-3 shrink-0" strokeWidth={2.5} />}
            {label}
        </button>
    );
}

// ── Category Filter Sheet (bottom drawer) ────────────────────────────────────

interface CategorySheetProps {
    open: boolean;
    onClose: () => void;
    categories: { id: number; name: string; slug: string }[];
    selected: number | null;
    onSelect: (id: number | null) => void;
}

function CategorySheet({ open, onClose, categories, selected, onSelect }: CategorySheetProps) {
    const overlayRef = useRef<HTMLDivElement>(null);

    // Close on overlay click
    const handleOverlay = useCallback(
        (e: React.MouseEvent) => {
            if (e.target === overlayRef.current) onClose();
        },
        [onClose],
    );

    // Close on ESC
    useEffect(() => {
        if (!open) return;
        const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [open, onClose]);

    // Prevent body scroll when open
    useEffect(() => {
        document.body.style.overflow = open ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [open]);

    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* Overlay */}
                    <motion.div
                        ref={overlayRef}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]"
                        onClick={handleOverlay}
                        aria-hidden
                    />

                    {/* Sheet */}
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 28, stiffness: 300 }}
                        className="fixed inset-x-0 bottom-0 z-50 rounded-t-3xl bg-white pb-safe"
                        role="dialog"
                        aria-label="فلترة حسب التصنيف"
                        dir="rtl"
                    >
                        {/* Handle */}
                        <div className="flex justify-center pt-3 pb-1">
                            <div className="h-1 w-10 rounded-full bg-gray-200" />
                        </div>

                        {/* Header */}
                        <div className="flex items-center justify-between px-5 py-3">
                            <h2 className="text-base font-bold text-gray-900">اختر التصنيف</h2>
                            <button
                                type="button"
                                onClick={onClose}
                                className="rounded-full p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F]/40"
                                aria-label="إغلاق"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="h-px bg-gray-100" />

                        {/* List — matches design image 2 */}
                        <ul className="max-h-[60vh] overflow-y-auto overscroll-contain pb-6">
                            {/* "All" option */}
                            <li>
                                <button
                                    type="button"
                                    onClick={() => { onSelect(null); onClose(); }}
                                    className="flex w-full items-center justify-between px-5 py-4 text-right transition-colors hover:bg-gray-50 active:bg-gray-100"
                                >
                                    <span className="text-sm font-medium text-gray-900">جميع التصنيفات</span>
                                    <span
                                        className={[
                                            "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                                            selected === null
                                                ? "border-[#30913F] bg-[#30913F]"
                                                : "border-gray-300 bg-white",
                                        ].join(" ")}
                                    >
                                        {selected === null && (
                                            <Check className="h-3 w-3 text-white" strokeWidth={3} />
                                        )}
                                    </span>
                                </button>
                                <div className="mx-5 h-px bg-gray-100" />
                            </li>

                            {categories.map((cat) => (
                                <li key={cat.id}>
                                    <button
                                        type="button"
                                        onClick={() => { onSelect(cat.id); onClose(); }}
                                        className="flex w-full items-center justify-between px-5 py-4 text-right transition-colors hover:bg-gray-50 active:bg-gray-100"
                                    >
                                        <span className="text-sm font-medium text-gray-900">{cat.name}</span>
                                        <span
                                            className={[
                                                "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                                                selected === cat.id
                                                    ? "border-[#30913F] bg-[#30913F]"
                                                    : "border-gray-300 bg-white",
                                            ].join(" ")}
                                        >
                                            {selected === cat.id && (
                                                <Check className="h-3 w-3 text-white" strokeWidth={3} />
                                            )}
                                        </span>
                                    </button>
                                    <div className="mx-5 h-px bg-gray-100" />
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

// ── Filter Bar ────────────────────────────────────────────────────────────────

interface FilterBarProps {
    filters: StoreFilters;
    onChange: (f: StoreFilters) => void;
    categories: { id: number; name: string; slug: string }[];
    categoriesLoading: boolean;
}

function FilterBar({ filters, onChange, categories, categoriesLoading }: FilterBarProps) {
    const [sheetOpen, setSheetOpen] = useState(false);

    const toggle = (key: keyof StoreFilters) =>
        onChange({ ...filters, [key]: !filters[key as keyof StoreFilters] });

    const chipFiltersCount = countActiveChipFilters(filters);
    const selectedCategoryName =
        filters.categoryId !== null
            ? categories.find((c) => c.id === filters.categoryId)?.name ?? "تصنيف"
            : null;

    return (
        <>
            {/* Horizontal scrollable chip bar */}
            <div
                className={[
                    "flex items-center gap-2 overflow-x-auto pb-1",
                    "snap-x [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
                ].join(" ")}
                dir="rtl"
                role="group"
                aria-label="فلاتر المتاجر"
            >
                {/* Category button — opens sheet */}
                <button
                    type="button"
                    onClick={() => setSheetOpen(true)}
                    disabled={categoriesLoading}
                    className={[
                        "inline-flex shrink-0 snap-start items-center gap-1.5 rounded-full px-3.5 py-1.5",
                        "text-xs font-semibold transition-all duration-150",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F]/40",
                        filters.categoryId !== null
                            ? "bg-[#30913F] text-white shadow-sm"
                            : "bg-white text-gray-700 ring-1 ring-gray-200 hover:ring-[#30913F]/40",
                        "disabled:opacity-50",
                    ].join(" ")}
                    aria-haspopup="dialog"
                    aria-expanded={sheetOpen}
                >
                    <SlidersHorizontal className="h-3 w-3 shrink-0" strokeWidth={2.5} />
                    {selectedCategoryName ?? "التصنيف"}
                    {filters.categoryId !== null && (
                        <span
                            role="button"
                            tabIndex={0}
                            aria-label="إزالة فلتر التصنيف"
                            className="ms-0.5 rounded-full hover:bg-white/20"
                            onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                onChange({ ...filters, categoryId: null });
                            }}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                    e.stopPropagation();
                                    onChange({ ...filters, categoryId: null });
                                }
                            }}
                        >
                            <X className="h-3 w-3" />
                        </span>
                    )}
                </button>

                <FilterChip
                    label="عروض"
                    active={filters.hasOffer}
                    onClick={() => toggle("hasOffer")}
                />
                <FilterChip
                    label="توصيل مجاني"
                    active={filters.freeDelivery}
                    onClick={() => toggle("freeDelivery")}
                />
                <FilterChip
                    label="تقييم عالي"
                    active={filters.topRated}
                    onClick={() => toggle("topRated")}
                />
                <FilterChip
                    label="مفتوح الآن"
                    active={filters.openNow}
                    onClick={() => toggle("openNow")}
                />
                <FilterChip
                    label="توصيل سريع"
                    active={filters.under30Min}
                    onClick={() => toggle("under30Min")}
                />

                {/* Clear all — only show when filters active */}
                {hasActiveFilters(filters) && (
                    <button
                        type="button"
                        onClick={() => onChange(DEFAULT_FILTERS)}
                        className={[
                            "inline-flex shrink-0 items-center gap-1 rounded-full px-3 py-1.5",
                            "text-xs font-semibold text-red-500 ring-1 ring-red-200",
                            "transition-colors hover:bg-red-50",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300",
                        ].join(" ")}
                        aria-label="مسح جميع الفلاتر"
                    >
                        <X className="h-3 w-3" />
                        مسح
                    </button>
                )}
            </div>

            {/* Category bottom sheet */}
            <CategorySheet
                open={sheetOpen}
                onClose={() => setSheetOpen(false)}
                categories={categories}
                selected={filters.categoryId}
                onSelect={(id) => onChange({ ...filters, categoryId: id })}
            />
        </>
    );
}

// ── Empty State ───────────────────────────────────────────────────────────────

function EmptyState({ hasFilters, onClear }: { hasFilters: boolean; onClear: () => void }) {
    return (
        <div className="flex flex-col items-center justify-center gap-3 py-14 text-center" dir="rtl">
            <span className="text-4xl" aria-hidden>🏪</span>
            <p className="text-sm font-semibold text-gray-700">
                {hasFilters ? "لا توجد متاجر تطابق الفلتر" : "لا توجد متاجر متاحة حالياً"}
            </p>
            {hasFilters && (
                <button
                    type="button"
                    onClick={onClear}
                    className="rounded-xl bg-[#F6F5F8] px-5 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-200"
                >
                    مسح الفلاتر
                </button>
            )}
        </div>
    );
}

// ── Main Component ────────────────────────────────────────────────────────────

interface StoresProps {
    moduleId: string;
    moduleName: string;
}

export default function Stores({ moduleId }: StoresProps) {
    const { stores, isLoading, isLoadingMore, error, hasMore, filters, setFilters, loadMore } =
        useStores(moduleId);

    const { categories, isLoading: catsLoading } = useCategories(moduleId);

    const filtersActive = hasActiveFilters(filters);

    return (
        <section
            className="mx-auto w-full max-w-2xl space-y-3 px-4 sm:px-6"
            aria-label="المتاجر"
            dir="rtl"
        >
            {/* Section header */}
            <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-gray-900">
                    {filtersActive ? "نتائج الفلتر" : "المتاجر القريبة منك"}
                </h2>
                {!isLoading && stores.length > 0 && (
                    <span className="text-xs text-gray-400">
                        {stores.length} متجر
                    </span>
                )}
            </div>

            {/* Filter bar */}
            <FilterBar
                filters={filters}
                onChange={setFilters}
                categories={categories}
                categoriesLoading={catsLoading}
            />

            {/* Content */}
            {isLoading ? (
                <StoresSkeleton />
            ) : error ? (
                <EmptyState hasFilters={filtersActive} onClear={() => setFilters(DEFAULT_FILTERS)} />
            ) : stores.length === 0 ? (
                <EmptyState hasFilters={filtersActive} onClear={() => setFilters(DEFAULT_FILTERS)} />
            ) : (
                <AnimatePresence mode="wait">
                    <motion.div
                        key={JSON.stringify(filters)}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.25 }}
                        className="space-y-3"
                    >
                        {stores.map((store) => (
                            <StoreCard key={store.id} store={store} />
                        ))}
                    </motion.div>
                </AnimatePresence>
            )}

            {/* Load more */}
            {hasMore && !isLoading && (
                <div className="flex justify-center pt-1">
                    <button
                        type="button"
                        onClick={loadMore}
                        disabled={isLoadingMore}
                        className={[
                            "rounded-xl bg-[#F6F5F8] px-6 py-2.5 text-sm font-semibold text-gray-800",
                            "transition-colors hover:bg-gray-200",
                            "disabled:cursor-not-allowed disabled:opacity-60",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F]/30",
                        ].join(" ")}
                    >
                        {isLoadingMore ? "جاري التحميل..." : "عرض المزيد"}
                    </button>
                </div>
            )}
        </section>
    );
}


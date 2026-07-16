"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

type SortOption = "popular" | "price-asc" | "price-desc";
type PriceRange =
    | "all"
    | "0-10"
    | "0-20"
    | "70-40"
    | "70-100"
    | "100-150"
    | "150-200"
    | "200-300"
    | "300-500"
    | "500-700"
    | "700-1000";

export interface FilterValues {
    sort: SortOption;
    price: PriceRange;
}

export const DEFAULT_FILTER_VALUES: FilterValues = { sort: "popular", price: "all" };

interface FilterSheetProps {
    open: boolean;
    onClose: () => void;
    onApply: (filters: FilterValues) => void;
    /** Current filter values when the sheet opens. Defaults to "popular"/"all". */
    initialValues?: FilterValues;
    isArabic: boolean;
}

const SORT_OPTIONS: { value: SortOption; label: { ar: string; en: string } }[] = [
    { value: "price-desc", label: { ar: "تنازلي من (ي - أ)", en: "Z to A" } },
    { value: "price-asc", label: { ar: "تصاعدي من (أ - ي)", en: "A to Z" } },
    { value: "popular", label: { ar: "شائع", en: "Popular" } },
];

const PRICE_RANGES: { value: PriceRange; label: string }[] = [
    { value: "all", label: "all" },
    { value: "0-10", label: "0 - 10" },
    { value: "0-20", label: "0 - 20" },
    { value: "70-40", label: "40 - 70" },
    { value: "70-100", label: "70 - 100" },
    { value: "100-150", label: "100 - 150" },
    { value: "150-200", label: "150 - 200" },
    { value: "200-300", label: "200 - 300" },
    { value: "300-500", label: "300 - 500" },
    { value: "500-700", label: "500 - 700" },
    { value: "700-1000", label: "700 - 1000" },
];

export function FilterSheet({
    open,
    onClose,
    onApply,
    initialValues,
    isArabic,
}: FilterSheetProps) {
    const [sort, setSort] = useState<SortOption>(initialValues?.sort ?? "popular");
    const [price, setPrice] = useState<PriceRange>(initialValues?.price ?? "all");

    // Re-sync when the sheet opens so it reflects the latest applied filter.
    useEffect(() => {
        if (open) {
            setSort(initialValues?.sort ?? "popular");
            setPrice(initialValues?.price ?? "all");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    if (!open) return null;

    const handleReset = () => {
        setSort("popular");
        setPrice("all");
    };

    const handleApply = () => {
        onApply({ sort, price });
        onClose();
    };

    return (
        <div
            className="fixed inset-0 z-[999] flex items-end justify-center bg-black/40 sm:items-center md:p-6"
            onClick={onClose}
        >
            <div
                dir={isArabic ? "rtl" : "ltr"}
                lang={isArabic ? "ar" : "en"}
                role="dialog"
                aria-modal="true"
                aria-label={isArabic ? "فلتر" : "Filter"}
                onClick={(e) => e.stopPropagation()}
                className="flex max-h-[92dvh] w-full max-w-md flex-col overflow-y-auto rounded-t-3xl bg-background
                           px-4 pt-4 pb-[calc(1.5rem+env(safe-area-inset-bottom))] sm:max-h-[90dvh] sm:rounded-3xl sm:px-5 sm:pb-6 lg:max-w-lg"
            >
                <div className="relative flex items-center justify-center pb-5">
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label={isArabic ? "إغلاق" : "Close"}
                        className="absolute end-0 flex h-8 w-8 items-center justify-center
                                   rounded-full bg-card text-foreground
                                   transition-colors hover:brightness-95
                                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                    >
                        <X className="h-3.5 w-3.5" strokeWidth={1.5} />
                    </button>
                    <h2 className="text-base font-bold text-foreground">
                        {isArabic ? "فلتر" : "Filter"}
                    </h2>
                </div>

                <section className="pb-6">
                    <h3 className="pb-3 text-[15px] font-bold text-foreground">
                        {isArabic ? "الترتيب حسب" : "Sort by"}
                    </h3>
                    <div className="flex flex-wrap gap-2.5">
                        {SORT_OPTIONS.map((option) => (
                            <Chip
                                key={option.value}
                                label={isArabic ? option.label.ar : option.label.en}
                                selected={sort === option.value}
                                onClick={() => setSort(option.value)}
                            />
                        ))}
                    </div>
                </section>

                <section className="pb-6">
                    <h3 className="pb-3 text-[15px] font-bold text-foreground">
                        {isArabic ? "النطاق السعري" : "Price range"}
                    </h3>
                    <div className="grid grid-cols-3 gap-2.5">
                        {PRICE_RANGES.map((option) => (
                            <Chip
                                key={option.value}
                                label={
                                    option.value === "all"
                                        ? isArabic
                                            ? "الجميع"
                                            : "All"
                                        : option.label
                                }
                                selected={price === option.value}
                                onClick={() => setPrice(option.value)}
                                fullWidth
                            />
                        ))}
                    </div>
                </section>

                <div className="flex flex-col gap-3 pt-2">
                    <button
                        type="button"
                        onClick={handleApply}
                        className="h-12 w-full rounded-xl bg-brand text-[15px] font-bold text-brand-foreground
                                   transition-transform active:scale-[0.98]
                                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    >
                        {isArabic ? "تم" : "Done"}
                    </button>
                    <button
                        type="button"
                        onClick={handleReset}
                        className="h-12 w-full rounded-xl bg-card text-[15px] font-bold text-foreground
                                   transition-colors hover:brightness-95 active:scale-[0.98]
                                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                    >
                        {isArabic ? "إعادة الضبط" : "Reset"}
                    </button>
                </div>
            </div>
        </div>
    );
}

function Chip({
    label,
    selected,
    onClick,
    fullWidth,
}: {
    label: string;
    selected: boolean;
    onClick: () => void;
    fullWidth?: boolean;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-pressed={selected}
            className={[
                "flex h-[37px] items-center justify-center rounded-md px-3",
                "text-[13px] font-medium whitespace-nowrap transition-colors",
                fullWidth ? "w-full" : "",
                selected
                    ? "bg-brand/10 text-brand"
                    : "bg-card text-muted hover:brightness-95",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand",
            ].join(" ")}
        >
            {label}
        </button>
    );
}

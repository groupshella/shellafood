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
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
    { value: "price-desc", label: "تنازلي من (ي - أ)" },
    { value: "price-asc", label: "تصاعدي من (أ - ي)" },
    { value: "popular", label: "شائع" },
];

const PRICE_RANGES: { value: PriceRange; label: string }[] = [
    { value: "all", label: "الجميع" },
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

export function FilterSheet({ open, onClose, onApply, initialValues }: FilterSheetProps) {
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
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center"
            onClick={onClose}
        >
            <div
                dir="rtl"
                role="dialog"
                aria-modal="true"
                aria-label="فلتر"
                onClick={(e) => e.stopPropagation()}
                className="flex max-h-[92dvh] w-full max-w-md flex-col overflow-y-auto rounded-t-3xl bg-white
                           px-4 pt-4 pb-[calc(1.5rem+env(safe-area-inset-bottom))] dark:bg-gray-900 sm:max-h-[90dvh] sm:rounded-3xl sm:px-5 sm:pb-6"
            >
                <div className="relative flex items-center justify-center pb-5">
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="إغلاق"
                        className="absolute end-0 flex h-8 w-8 items-center justify-center
                                   rounded-full bg-[#F6F5F8] text-[#111B18]
                                   transition-colors hover:bg-[#ECECEF]
                                   dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700
                                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F]"
                    >
                        <X className="h-3.5 w-3.5" strokeWidth={1.5} />
                    </button>
                    <h2 className="text-base font-bold text-[#111B18] dark:text-gray-50">فلتر</h2>
                </div>

                <section className="pb-6">
                    <h3 className="pb-3 text-[15px] font-bold text-[#111B18] dark:text-gray-200">الترتيب حسب</h3>
                    <div className="flex flex-wrap gap-2.5">
                        {SORT_OPTIONS.map((option) => (
                            <Chip
                                key={option.value}
                                label={option.label}
                                selected={sort === option.value}
                                onClick={() => setSort(option.value)}
                            />
                        ))}
                    </div>
                </section>

                <section className="pb-6">
                    <h3 className="pb-3 text-[15px] font-bold text-[#111B18] dark:text-gray-200">النطاق السعري</h3>
                    <div className="grid grid-cols-3 gap-2.5">
                        {PRICE_RANGES.map((option) => (
                            <Chip
                                key={option.value}
                                label={option.label}
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
                        className="h-12 w-full rounded-xl bg-[#30913F] text-[15px] font-bold text-white
                                   transition-transform active:scale-[0.98]
                                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
                    >
                        تم
                    </button>
                    <button
                        type="button"
                        onClick={handleReset}
                        className="h-12 w-full rounded-xl bg-[#F6F6F6] text-[15px] font-bold text-[#43474F]
                                   transition-colors hover:bg-[#ECECEC] active:scale-[0.98]
                                   dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700
                                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F]"
                    >
                        إعادة الضبط
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
                    ? "bg-[#EBFEEB] text-[#30913F] dark:bg-[#30913F]/15 dark:text-[#4db860]"
                    : "bg-[#F6F5F8] text-[#43474F] hover:bg-[#ECECEF] dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F]",
            ].join(" ")}
        >
            {label}
        </button>
    );
}
"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { FilterState, PriceRange } from "../../types/brands.types";
import { EMPTY_FILTER, PRICE_RANGES } from "../../types/brands.types";

interface FilterSheetProps {
    isOpen: boolean;
    isVisible: boolean;
    onClose: () => void;
    applied: FilterState | null;
    onApply: (f: FilterState) => void;
    onClear: () => void;
    isArabic: boolean;
}

export function FilterSheet({
    isOpen,
    isVisible,
    onClose,
    applied,
    onApply,
    onClear,
    isArabic,
}: FilterSheetProps) {
    const [draft, setDraft] = useState<FilterState>(EMPTY_FILTER);

    useEffect(() => {
        if (isOpen) setDraft(applied ?? EMPTY_FILTER);
    }, [isOpen, applied]);

    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const selectPriceRange = (range: PriceRange) => {
        setDraft((prev) => ({
            ...prev,
            priceRange: prev.priceRange?.id === range.id ? null : range,
        }));
    };

    return (
        <div
            className="fixed inset-0 z-[999] flex items-end justify-center bg-black/40 sm:items-center"
            style={{ opacity: isVisible ? 1 : 0, transition: "opacity 300ms ease" }}
            onClick={onClose}
            aria-hidden={!isVisible}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-label={isArabic ? "فلتر" : "Filter"}
                dir={isArabic ? "rtl" : "ltr"}
                lang={isArabic ? "ar" : "en"}
                onClick={(e) => e.stopPropagation()}
                className="flex max-h-[92dvh] w-full max-w-md flex-col overflow-y-auto rounded-t-3xl bg-background px-4 pt-3 pb-[calc(2.5rem+env(safe-area-inset-bottom))] shadow-2xl sm:max-h-[90dvh] sm:max-w-lg sm:rounded-3xl sm:px-5 sm:pb-10 md:max-w-xl"
                style={{
                    transform: isVisible ? "translateY(0)" : "translateY(100%)",
                    transition: "transform 350ms cubic-bezier(0.32, 0.72, 0, 1)",
                }}
            >
                <div className="mx-auto mb-4 h-1 w-9 rounded-full bg-border" />

                <div className="relative mb-6 flex items-center justify-center">
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label={isArabic ? "إغلاق" : "Close"}
                        className="absolute start-0 flex h-8 w-8 items-center justify-center rounded-full bg-card text-foreground transition-colors active:brightness-95"
                    >
                        <X className="h-4 w-4" strokeWidth={2.5} />
                    </button>
                    <h2 className="text-[16px] font-semibold text-foreground">
                        {isArabic ? "فلتر" : "Filter"}
                    </h2>
                </div>

                <div className="mb-8">
                    <p className="mb-3 text-[13px] font-semibold text-foreground">
                        {isArabic ? "نطاق السعر" : "Price range"}
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {PRICE_RANGES.map((range) => {
                            const isSelected = draft.priceRange?.id === range.id;
                            return (
                                <button
                                    key={range.id}
                                    type="button"
                                    onClick={() => selectPriceRange(range)}
                                    aria-pressed={isSelected}
                                    className={[
                                        "rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors",
                                        isSelected
                                            ? "border border-brand bg-brand/10 text-brand"
                                            : "border border-border bg-card text-muted",
                                    ].join(" ")}
                                >
                                    {range.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={() => {
                            setDraft(EMPTY_FILTER);
                            onClear();
                        }}
                        className="flex-1 rounded-xl bg-card py-3.5 text-[14px] font-semibold text-foreground transition-colors active:brightness-95"
                    >
                        {isArabic ? "إعادة تعيين" : "Reset"}
                    </button>
                    <button
                        type="button"
                        onClick={() => onApply(draft)}
                        className="flex-1 rounded-xl bg-brand py-3.5 text-[14px] font-semibold text-brand-foreground transition-colors hover:brightness-95 active:brightness-90"
                    >
                        {isArabic ? "تطبيق" : "Apply"}
                    </button>
                </div>
            </div>
        </div>
    );
}

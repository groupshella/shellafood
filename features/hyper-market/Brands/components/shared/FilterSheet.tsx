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
}

export function FilterSheet({
    isOpen,
    isVisible,
    onClose,
    applied,
    onApply,
    onClear,
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
        <>
            <div
                className="fixed inset-0 z-40 bg-black/25 transition-opacity duration-300"
                style={{ opacity: isVisible ? 1 : 0 }}
                onClick={onClose}
                aria-hidden
            />

            <div
                role="dialog"
                aria-modal
                aria-label="فلتر"
                dir="rtl"
                className="fixed inset-x-0 bottom-0 z-50 rounded-t-[20px] bg-white px-5 pb-10 pt-3 shadow-2xl"
                style={{
                    transform: isVisible ? "translateY(0)" : "translateY(100%)",
                    transition: "transform 350ms cubic-bezier(0.32, 0.72, 0, 1)",
                }}
            >
                <div className="mx-auto mb-4 h-1 w-9 rounded-full bg-gray-200" />

                <div className="relative mb-6 flex items-center justify-center">
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="إغلاق"
                        className="absolute start-0 flex h-8 w-8 items-center justify-center rounded-full bg-[#F6F5F8] text-gray-700 transition-colors active:bg-gray-200"
                    >
                        <X className="h-4 w-4" strokeWidth={2.5} />
                    </button>
                    <h2 className="text-[16px] font-semibold text-gray-900">فلتر</h2>
                </div>

                <div className="mb-8">
                    <p className="mb-3 text-[13px] font-semibold text-gray-800">نطاق السعر</p>
                    <div className="flex flex-wrap gap-2">
                        {PRICE_RANGES.map((range) => {
                            const isSelected = draft.priceRange?.id === range.id;
                            return (
                                <button
                                    key={range.id}
                                    type="button"
                                    onClick={() => selectPriceRange(range)}
                                    className={[
                                        "rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors",
                                        isSelected
                                            ? "border border-[#30913F] bg-[#EBFEEB] text-[#30913F]"
                                            : "border border-gray-200 bg-white text-gray-600 active:bg-gray-50",
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
                        className="flex-1 rounded-xl bg-[#F6F5F8] py-3.5 text-[14px] font-semibold text-gray-700 transition-colors active:bg-gray-200"
                    >
                        إعادة تعيين
                    </button>
                    <button
                        type="button"
                        onClick={() => onApply(draft)}
                        className="flex-1 rounded-xl bg-[#30913F] py-3.5 text-[14px] font-semibold text-white transition-colors active:bg-[#267332]"
                    >
                        تطبيق
                    </button>
                </div>
            </div>
        </>
    );
}

"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { WALLET_FILTER_OPTIONS } from "@/features/profile/constants/wallet.strings";
import type { WalletHistoryFilter } from "@/features/profile/types/wallet.types";

const TAJAWAL = { fontFamily: "'Tajawal', sans-serif" } as const;

export function WalletFilterDropdown({
    value,
    onChange,
}: {
    value: WalletHistoryFilter;
    onChange: (next: WalletHistoryFilter) => void;
}) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const selected =
        WALLET_FILTER_OPTIONS.find((o) => o.id === value) ??
        WALLET_FILTER_OPTIONS[0];

    useEffect(() => {
        if (!open) return;
        const onPointerDown = (event: MouseEvent) => {
            if (!ref.current?.contains(event.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", onPointerDown);
        return () => document.removeEventListener("mousedown", onPointerDown);
    }, [open]);

    return (
        <div ref={ref} className="relative shrink-0">
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className="flex h-[33px] max-w-[180px] items-center gap-1.5 rounded-[8px] bg-[#F6F5F8] px-2.5 py-1.5 dark:bg-gray-800 sm:max-w-[220px]"
                aria-expanded={open}
                aria-haspopup="listbox"
            >
                <ChevronDown
                    className={[
                        "h-3.5 w-3.5 shrink-0 text-[#111B18] transition-transform dark:text-gray-100",
                        open ? "rotate-180" : "",
                    ].join(" ")}
                    strokeWidth={2}
                />
                <span
                    className="truncate text-[12px] font-medium text-[#111B18] dark:text-gray-100 sm:text-[13px]"
                    style={TAJAWAL}
                >
                    {selected.label}
                </span>
            </button>

            {open && (
                <div
                    role="listbox"
                    className="absolute start-0 top-[calc(100%+6px)] z-30 w-[min(260px,80vw)] overflow-hidden rounded-[10px] border border-[#F6F5F8] bg-white shadow-[0px_4px_16px_rgba(0,0,0,0.1)] dark:border-gray-700 dark:bg-gray-800"
                >
                    {WALLET_FILTER_OPTIONS.map((option, index) => {
                        const isSelected = option.id === value;
                        return (
                            <div key={option.id}>
                                <button
                                    type="button"
                                    role="option"
                                    aria-selected={isSelected}
                                    onClick={() => {
                                        onChange(option.id);
                                        setOpen(false);
                                    }}
                                    className={[
                                        "flex w-full items-center justify-end px-3 py-2.5 text-end text-[13px] font-medium transition-colors",
                                        isSelected
                                            ? "bg-[#EBFEEB] text-[#30913F] dark:bg-[#30913F]/15"
                                            : "text-[#111B18] hover:bg-[#F6F5F8] dark:text-gray-100 dark:hover:bg-gray-700",
                                    ].join(" ")}
                                    style={TAJAWAL}
                                >
                                    {option.label}
                                </button>
                                {index < WALLET_FILTER_OPTIONS.length - 1 && (
                                    <div className="mx-3 border-t border-[#F0EFF3] dark:border-gray-700" />
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

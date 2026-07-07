"use client";

import { Minus, Plus } from "lucide-react";

interface QuantityPillProps {
    quantity: number;
    onIncrease: () => void;
    onDecrease: () => void;
    disabled?: boolean;
    isSyncing?: boolean;
    size?: "sm" | "md";
    className?: string;
}

export function QuantityPill({
    quantity,
    onIncrease,
    onDecrease,
    disabled = false,
    isSyncing = false,
    size = "md",
    className = "",
}: QuantityPillProps) {
    const isSm = size === "sm";

    return (
        <div
            className={[
                "flex shrink-0 items-center justify-between rounded-full bg-[#45C553] shadow-md",
                isSm ? "h-8 min-w-[76px] px-2 sm:h-7 sm:min-w-[72px]" : "h-11 min-w-[108px] px-3 sm:h-12 sm:min-w-[116px] sm:px-3.5",
                disabled ? "pointer-events-none opacity-60" : "",
                className,
            ].join(" ")}
        >
            <button
                type="button"
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onDecrease();
                }}
                disabled={disabled}
                aria-label="تقليل الكمية"
                className={[
                    "flex items-center justify-center rounded-full text-white/80 transition-transform active:scale-90",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60",
                    isSm ? "h-6 w-6 sm:h-5 sm:w-5" : "h-7 w-7 sm:h-8 sm:w-8",
                ].join(" ")}
            >
                <Minus className={isSm ? "h-3.5 w-3.5 sm:h-3 sm:w-3" : "h-4 w-4 sm:h-[18px] sm:w-[18px]"} strokeWidth={2.5} />
            </button>

            <span
                className={[
                    "min-w-[1.25rem] text-center font-bold text-white transition-opacity duration-200",
                    isSm ? "text-xs" : "text-base",
                    isSyncing ? "opacity-70" : "opacity-100",
                ].join(" ")}
            >
                {quantity}
            </span>

            <button
                type="button"
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onIncrease();
                }}
                disabled={disabled}
                aria-label="زيادة الكمية"
                className={[
                    "flex items-center justify-center rounded-full text-white/80 transition-transform active:scale-90",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60",
                    isSm ? "h-6 w-6 sm:h-5 sm:w-5" : "h-7 w-7 sm:h-8 sm:w-8",
                ].join(" ")}
            >
                <Plus className={isSm ? "h-3.5 w-3.5 sm:h-3 sm:w-3" : "h-4 w-4 sm:h-[18px] sm:w-[18px]"} strokeWidth={2.5} />
            </button>
        </div>
    );
}

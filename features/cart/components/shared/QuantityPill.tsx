"use client";

import { Minus, Plus } from "lucide-react";

interface QuantityPillProps {
    quantity: number;
    onIncrease: () => void;
    onDecrease: () => void;
    disabled?: boolean;
    size?: "sm" | "md";
    className?: string;
}

export function QuantityPill({
    quantity,
    onIncrease,
    onDecrease,
    disabled = false,
    size = "md",
    className = "",
}: QuantityPillProps) {
    const isSm = size === "sm";

    return (
        <div
            className={[
                "flex shrink-0 items-center justify-between rounded-full bg-[#45C553] shadow-md",
                isSm ? "h-7 min-w-[72px] px-2" : "h-11 min-w-[108px] px-3",
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
                    isSm ? "h-5 w-5" : "h-7 w-7",
                ].join(" ")}
            >
                <Minus className={isSm ? "h-3 w-3" : "h-4 w-4"} strokeWidth={2.5} />
            </button>

            <span
                className={[
                    "min-w-[1.25rem] text-center font-bold text-white",
                    isSm ? "text-xs" : "text-base",
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
                    isSm ? "h-5 w-5" : "h-7 w-7",
                ].join(" ")}
            >
                <Plus className={isSm ? "h-3 w-3" : "h-4 w-4"} strokeWidth={2.5} />
            </button>
        </div>
    );
}

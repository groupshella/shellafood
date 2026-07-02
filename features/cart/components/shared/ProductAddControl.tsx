"use client";

import { useEffect } from "react";
import { Plus } from "lucide-react";
import { QuantityPill } from "./QuantityPill";
import { ProductCartMeta } from "../../lib/match-cart-line";
import { useProductCart } from "../../hooks/useProductCart";

interface ProductAddControlProps {
    product: ProductCartMeta;
    isAvailable?: boolean;
    size?: "sm" | "md";
    variant?: "solid" | "soft";
    className?: string;
    onError?: (message: string | null) => void;
}

export function ProductAddControl({
    product,
    isAvailable = true,
    size = "sm",
    variant = "solid",
    className = "",
    onError,
}: ProductAddControlProps) {
    const { quantity, isPending, error, handleAdd, handleIncrease, handleDecrease } =
        useProductCart(product, isAvailable);

    useEffect(() => {
        onError?.(error);
    }, [error, onError]);

    if (quantity > 0) {
        return (
            <QuantityPill
                quantity={quantity}
                onIncrease={handleIncrease}
                onDecrease={handleDecrease}
                disabled={!isAvailable}
                isSyncing={isPending}
                size={size}
                className={className}
            />
        );
    }

    const isSm = size === "sm";
    const isSoft = variant === "soft";
    const isDisabled = !isAvailable;

    return (
        <button
            type="button"
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleAdd();
            }}
            disabled={isDisabled}
            aria-label="إضافة إلى السلة"
            className={[
                "flex shrink-0 items-center justify-center rounded-full transition-transform active:scale-90",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-1",
                isSm ? "h-7 w-7" : "h-11 w-11",
                isSoft
                    ? "bg-[#E8F8EA] shadow-[0_2px_10px_rgba(48,145,63,0.18)]"
                    : "bg-[#45C553] shadow-md",
                isDisabled ? "cursor-not-allowed bg-gray-200 shadow-none" : "",
                className,
            ].join(" ")}
        >
            <Plus
                className={[
                    isSm ? "h-3.5 w-3.5" : "h-5 w-5",
                    isDisabled
                        ? "text-gray-400"
                        : isSoft
                            ? "text-[#30913F]"
                            : "text-white",
                ].join(" ")}
                strokeWidth={2.5}
            />
        </button>
    );
}

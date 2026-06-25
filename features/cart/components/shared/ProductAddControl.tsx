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
    className?: string;
    onError?: (message: string | null) => void;
}

export function ProductAddControl({
    product,
    isAvailable = true,
    size = "sm",
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
                disabled={!isAvailable || isPending}
                size={size}
                className={className}
            />
        );
    }

    const isSm = size === "sm";

    return (
        <button
            type="button"
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleAdd();
            }}
            disabled={!isAvailable || isPending}
            aria-label="إضافة إلى السلة"
            className={[
                "flex shrink-0 items-center justify-center rounded-full bg-[#45C553] shadow-md",
                "transition-transform active:scale-90",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-1",
                isSm ? "h-7 w-7" : "h-11 w-11",
                !isAvailable || isPending ? "cursor-not-allowed bg-gray-200" : "",
                className,
            ].join(" ")}
        >
            <Plus
                className={[
                    isSm ? "h-3.5 w-3.5" : "h-5 w-5",
                    !isAvailable || isPending ? "text-gray-400" : "text-white",
                ].join(" ")}
                strokeWidth={2.5}
            />
        </button>
    );
}

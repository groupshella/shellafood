"use client";

import { memo, useEffect, useRef, useState } from "react";
import { Loader2, Plus } from "lucide-react";
import { QuantityPill } from "./QuantityPill";
import { ProductCartMeta } from "../../lib/match-cart-line";
import { useProductCart } from "../../hooks/useProductCart";
import { useNotification } from "@/shared/components/NotificationToast";

interface ProductAddControlProps {
    product: ProductCartMeta;
    isAvailable?: boolean;
    size?: "sm" | "md";
    variant?: "solid" | "soft";
    className?: string;
    onError?: (message: string | null) => void;
}

export const ProductAddControl = memo(function ProductAddControl({
    product,
    isAvailable = true,
    size = "sm",
    variant = "solid",
    className = "",
    onError,
}: ProductAddControlProps) {
    const { error: notifyError } = useNotification();
    const lastNotifiedError = useRef<string | null>(null);
    const wasPendingRef = useRef(false);
    const { quantity, isPending, error, handleAdd, handleIncrease, handleDecrease } =
        useProductCart(product, isAvailable);

    // Keep showing the last confirmed quantity while a request is in flight so
    // a rejected add (e.g. different store) doesn't flash qty 1 then snap back.
    const [confirmedQuantity, setConfirmedQuantity] = useState(quantity);

    useEffect(() => {
        if (!isPending) {
            setConfirmedQuantity(quantity);
        }
    }, [isPending, quantity]);

    const displayQuantity = isPending && quantity > 1 ? quantity : confirmedQuantity;

    // Only toast after THIS add/update attempt finishes with an error —
    // never on mount from a leftover syncError.
    useEffect(() => {
        onError?.(error);

        const justFinished = wasPendingRef.current && !isPending;
        wasPendingRef.current = isPending;

        if (!error) {
            lastNotifiedError.current = null;
            return;
        }

        if (justFinished && error !== lastNotifiedError.current) {
            notifyError(error);
            lastNotifiedError.current = error;
        }
    }, [error, isPending, notifyError, onError]);

    if (displayQuantity > 0) {
        return (
            <QuantityPill
                quantity={displayQuantity}
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
    const isDisabled = !isAvailable || isPending;

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
                isSm ? "h-8 w-8 sm:h-7 sm:w-7" : "h-11 w-11 sm:h-12 sm:w-12",
                isSoft
                    ? "bg-[#E8F8EA] shadow-[0_2px_10px_rgba(48,145,63,0.18)]"
                    : "bg-[#45C553] shadow-md",
                !isAvailable ? "cursor-not-allowed bg-gray-200 shadow-none" : "",
                className,
            ].join(" ")}
        >
            {isPending ? (
                <Loader2
                    className={[
                        "animate-spin",
                        isSm ? "h-4 w-4 sm:h-3.5 sm:w-3.5" : "h-5 w-5 sm:h-[22px] sm:w-[22px]",
                        isSoft ? "text-[#30913F]" : "text-white",
                    ].join(" ")}
                    aria-hidden
                />
            ) : (
                <Plus
                    className={[
                        isSm ? "h-4 w-4 sm:h-3.5 sm:w-3.5" : "h-5 w-5 sm:h-[22px] sm:w-[22px]",
                        !isAvailable
                            ? "text-gray-400"
                            : isSoft
                                ? "text-[#30913F]"
                                : "text-white",
                    ].join(" ")}
                    strokeWidth={2.5}
                    aria-hidden
                />
            )}
        </button>
    );
});
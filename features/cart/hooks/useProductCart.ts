"use client";

import { useCallback, useState } from "react";
import { useCart } from "../context/CartContext";
import { ProductCartMeta } from "../lib/match-cart-line";

export function useProductCart(product: ProductCartMeta, isAvailable = true) {
    const { getQuantity, addProduct, incrementProduct, decrementProduct, isProductPending } =
        useCart();
    const [error, setError] = useState<string | null>(null);

    const quantity = getQuantity(product);
    const isPending = isProductPending(product.id);

    const handleAdd = useCallback(async () => {
        if (!isAvailable || isPending) return;
        setError(null);
        const result = await addProduct(product, 1);
        if (!result.success && result.message) setError(result.message);
    }, [addProduct, isAvailable, isPending, product]);

    const handleIncrease = useCallback(async () => {
        if (!isAvailable || isPending) return;
        setError(null);
        const result = await incrementProduct(product);
        if (!result.success && result.message) setError(result.message);
    }, [incrementProduct, isAvailable, isPending, product]);

    const handleDecrease = useCallback(async () => {
        if (!isAvailable || isPending) return;
        setError(null);
        const result = await decrementProduct(product);
        if (!result.success && result.message) setError(result.message);
    }, [decrementProduct, isAvailable, isPending, product]);

    return {
        quantity,
        isPending,
        error,
        handleAdd,
        handleIncrease,
        handleDecrease,
    };
}

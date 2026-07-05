"use client";

import { useCallback } from "react";
import { useCart } from "../context/CartContext";
import { ProductCartMeta } from "../lib/match-cart-line";

export function useProductCart(product: ProductCartMeta, isAvailable = true) {
    const {
        getQuantity,
        incrementProduct,
        decrementProduct,
        removeProduct,
        isProductPending,
        getProductSyncError,
        clearProductError,
    } = useCart();

    const quantity = getQuantity(product);
    const isPending = isProductPending(product.id);
    const error = getProductSyncError(product.id) ?? null;

    const mutate = useCallback(
        (action: () => ReturnType<typeof incrementProduct>) => {
            if (!isAvailable) return;
            clearProductError(product.id);
            void action();
        },
        [clearProductError, isAvailable, product.id]
    );

    const handleAdd = useCallback(
        () => mutate(() => incrementProduct(product)),
        [incrementProduct, mutate, product]
    );

    const handleIncrease = useCallback(
        () => mutate(() => incrementProduct(product)),
        [incrementProduct, mutate, product]
    );

    const handleDecrease = useCallback(
        () => mutate(() => decrementProduct(product)),
        [decrementProduct, mutate, product]
    );

    const handleRemove = useCallback(
        () => mutate(() => removeProduct(product)),
        [mutate, product, removeProduct]
    );

    return {
        quantity,
        isPending,
        error,
        handleAdd,
        handleIncrease,
        handleDecrease,
        handleRemove,
    };
}

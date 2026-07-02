"use client";

import { useCallback } from "react";
import { useCart } from "../context/CartContext";
import { ProductCartMeta } from "../lib/match-cart-line";

export function useProductCart(product: ProductCartMeta, isAvailable = true) {
    const {
        getQuantity,
        incrementProduct,
        decrementProduct,
        isProductPending,
        getProductSyncError,
        clearProductError,
    } = useCart();

    const quantity = getQuantity(product);
    const isPending = isProductPending(product.id);
    const error = getProductSyncError(product.id) ?? null;

    const handleAdd = useCallback(() => {
        if (!isAvailable) return;
        clearProductError(product.id);
        void incrementProduct(product);
    }, [clearProductError, incrementProduct, isAvailable, product]);

    const handleIncrease = useCallback(() => {
        if (!isAvailable) return;
        clearProductError(product.id);
        void incrementProduct(product);
    }, [clearProductError, incrementProduct, isAvailable, product]);

    const handleDecrease = useCallback(() => {
        if (!isAvailable) return;
        clearProductError(product.id);
        void decrementProduct(product);
    }, [clearProductError, decrementProduct, isAvailable, product]);

    return {
        quantity,
        isPending,
        error,
        handleAdd,
        handleIncrease,
        handleDecrease,
    };
}

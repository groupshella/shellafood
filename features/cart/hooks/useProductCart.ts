"use client";

import { useCallback, useMemo } from "react";
import { useCart } from "../context/CartContext";
import {
    cartItemToProductMeta,
    ProductCartMeta,
} from "../lib/match-cart-line";
import { CartItem } from "../types/cart.types";

type UseProductCartResult = {
    quantity: number;
    isPending: boolean;
    error: string | null;
    handleAdd: () => void;
    handleIncrease: () => void;
    handleDecrease: () => void;
    handleRemove: () => void;
};

export function useProductCart(
    item: CartItem
): UseProductCartResult & { item: CartItem };
export function useProductCart(
    product: ProductCartMeta,
    isAvailable?: boolean
): UseProductCartResult;
export function useProductCart(
    productOrItem: ProductCartMeta | CartItem,
    isAvailable = true
): UseProductCartResult & { item?: CartItem } {
    const isCartItem = "item_id" in productOrItem;

    const product = useMemo(() => {
        if (isCartItem) {
            return cartItemToProductMeta(productOrItem);
        }
        return productOrItem;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, isCartItem
        ? [
              productOrItem.item_id,
              productOrItem.name,
              productOrItem.price,
              productOrItem.discount,
          ]
        : [productOrItem]);

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

    const handleIncrease = useCallback(
        () => mutate(() => incrementProduct(product)),
        [incrementProduct, mutate, product]
    );

    const handleAdd = handleIncrease;

    const handleDecrease = useCallback(
        () => mutate(() => decrementProduct(product)),
        [decrementProduct, mutate, product]
    );

    const handleRemove = useCallback(
        () => mutate(() => removeProduct(product)),
        [mutate, product, removeProduct]
    );

    const result: UseProductCartResult = {
        quantity,
        isPending,
        error,
        handleAdd,
        handleIncrease,
        handleDecrease,
        handleRemove,
    };

    if (isCartItem) {
        return {
            ...result,
            item: { ...productOrItem, quantity },
        };
    }

    return result;
}

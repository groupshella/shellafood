"use client";

import { useMemo } from "react";
import { cartItemToProductMeta } from "../lib/match-cart-line";
import { CartItem } from "../types/cart.types";
import { useProductCart } from "./useProductCart";

export function useCartItem(item: CartItem) {
    const product = useMemo(
        () => cartItemToProductMeta(item),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [item.item_id, item.name, item.price, item.discount]
    );

    const { quantity, ...cart } = useProductCart(product);

    return {
        ...cart,
        quantity,
        item: { ...item, quantity },
    };
}

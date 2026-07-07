import { CartItem } from "../types/cart.types";
import { getDisplayPrice, matchCartLine, ProductCartMeta } from "./match-cart-line";

export function optimisticCartLineId(productId: number): number {
    return -productId;
}

export function isOptimisticCartLine(cartId: number): boolean {
    return cartId < 0;
}

export function applyOptimisticQuantity(
    items: CartItem[],
    product: ProductCartMeta,
    quantity: number
): CartItem[] {
    const line = matchCartLine(items, product);

    if (quantity <= 0) {
        return line ? items.filter((item) => item.id !== line.id) : items;
    }

    if (line) {
        return items.map((item) =>
            item.id === line.id ? { ...item, quantity } : item
        );
    }

    return [
        ...items,
        {
            item_id: product.id,
            id: optimisticCartLineId(product.id),
            name: product.name,
            description: "",
            price: getDisplayPrice(product),
            discount: product.discount ?? 0,
            image_full_url: "",
            quantity,
        },
    ];
}

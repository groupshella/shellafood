import { CartItem } from "../types/cart.types";

export interface ProductCartMeta {
    id: number;
    name: string;
    price: number;
    discount?: number;
}

export function getDisplayPrice(product: ProductCartMeta): number {
    const discount = product.discount ?? 0;
    return discount > 0 ? product.price * (1 - discount / 100) : product.price;
}

export function getBasePrice(price: number, discount: number): number {
    if (discount <= 0) return price;
    return price / (1 - discount / 100);
}

/** Maps a cart line back to product meta for optimistic mutations. */
export function cartItemToProductMeta(item: CartItem): ProductCartMeta {
    return {
        // Use item_id (the product's id) so that addToCart sends the correct id
        // and matchCartLine can find this product across fresh server responses.
        id: item.item_id,
        name: item.name,
        price: getBasePrice(item.price, item.discount),
        discount: item.discount,
    };
}

export function matchCartLine(
    items: CartItem[],
    product: ProductCartMeta
): CartItem | undefined {
    return items.find((item) => item.item_id === product.id);
}

export function getTotalCount(items: CartItem[]): number {
    return items.reduce((sum, item) => sum + item.quantity, 0);
}

export function getTotalPrice(items: CartItem[]): number {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}
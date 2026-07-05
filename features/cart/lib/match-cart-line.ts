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
    // Primary: server items carry item_id — reliable, no price/name tolerance needed.
    const byItemId = items.find(
        (item) => item.item_id != null && item.item_id === product.id
    );
    if (byItemId) return byItemId;

    // Fallback: optimistic items (id < 0) don't have item_id; match by name + price.
    const expectedPrice = getDisplayPrice(product);
    return items.find(
        (item) =>
            item.item_id == null &&
            item.name === product.name &&
            (Math.abs(item.price - expectedPrice) < 1 ||
                Math.abs(item.price - product.price) < 1)
    );
}

export function getTotalCount(items: CartItem[]): number {
    return items.reduce((sum, item) => sum + item.quantity, 0);
}

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

export function matchCartLine(
    items: CartItem[],
    product: ProductCartMeta
): CartItem | undefined {
    const expectedPrice = getDisplayPrice(product);

    return items.find(
        (item) =>
            item.name === product.name &&
            (Math.abs(item.price - expectedPrice) < 1 ||
                Math.abs(item.price - product.price) < 1)
    );
}

export function getTotalCount(items: CartItem[]): number {
    return items.reduce((sum, item) => sum + item.quantity, 0);
}

import type { CartItem, CartTotals, ApiCartItem } from '../types/cart.types';
import { CART_CONFIG } from '../constants/cart.constants';

export function mapApiCartToCartItems(apiCart: ApiCartItem[]): CartItem[] {
    if (!apiCart || !Array.isArray(apiCart)) return [];

    return apiCart
        .filter((cartItem) => cartItem != null && cartItem.item != null)
        .map((cartItem) => {
            const item = cartItem.item;
            return {
                id: String(cartItem.id),
                productId: String(cartItem.item_id),
                productName: item.name ?? '',
                productNameAr: item.name ?? '',
                productImage: item.image_full_url || item.image || '',
                quantity: Math.max(1, Number(cartItem.quantity) || 0),
                priceAtAdd: Number(cartItem.price) || 0,
                originalPrice: Number(cartItem.original_price) || Number(cartItem.price) || 0,
                storeId: String(item.store_id),
                storeName: item.store_name ?? '',
                storeNameAr: item.store_name ?? '',
                storeLogo: undefined,
                stock: item.stock ?? 0,
                unit: item.unit_type ?? '',
                unitAr: item.unit_type ?? '',
                hasSpecialOffer: (Number(cartItem.discount_amount) || 0) > 0,
                discountAmount: Number(cartItem.discount_amount) || 0,
            };
        });
}

export function calculateTotals(items: CartItem[]): CartTotals {
    const subtotal = items.reduce((sum, item) => sum + item.priceAtAdd * item.quantity, 0);
    const deliveryFee = 0;
    const discount = 0;
    const taxFee = subtotal * 0.15;
    const total = subtotal + deliveryFee + taxFee - discount;
    const itemsCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const remainingForFreeDelivery = Math.max(0, CART_CONFIG.FREE_DELIVERY_THRESHOLD - subtotal);

    return {
        subtotal,
        deliveryFee,
        taxFee,
        discount,
        total,
        itemsCount,
        remainingForFreeDelivery,
    };
}
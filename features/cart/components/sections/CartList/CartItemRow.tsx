"use client";

import { CartItem } from "@/features/cart/types/cart.types";
import { useCartItem } from "@/features/cart/hooks/useCartItem";
import { CartItemCard } from "./CartItemCard";

interface CartItemRowProps {
  item: CartItem;
}

export function CartItemRow({ item }: CartItemRowProps) {
  const { item: liveItem, isPending, handleIncrease, handleDecrease, handleRemove } =
    useCartItem(item);

  return (
    <CartItemCard
      item={liveItem}
      isUpdating={isPending}
      onIncrease={handleIncrease}
      onDecrease={handleDecrease}
      onRemove={handleRemove}
    />
  );
}

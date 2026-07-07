"use client";

import { useState } from "react";
import { CartItem } from "@/features/cart/types/cart.types";
import { useCartItem } from "@/features/cart/hooks/useCartItem";
import { RemoveProductConfirmSheet } from "@/features/cart/components/shared/RemoveProductConfirmSheet";
import { CartItemCard } from "./CartItemCard";

interface CartItemRowProps {
  item: CartItem;
}

export function CartItemRow({ item }: CartItemRowProps) {
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const { item: liveItem, isPending, handleIncrease, handleDecrease, handleRemove } =
    useCartItem(item);

  async function confirmRemove() {
    await handleRemove();
    setShowRemoveConfirm(false);
  }

  return (
    <>
      <CartItemCard
        item={liveItem}
        isUpdating={isPending}
        onIncrease={handleIncrease}
        onDecrease={handleDecrease}
        onRemove={() => setShowRemoveConfirm(true)}
      />

      <RemoveProductConfirmSheet
        isOpen={showRemoveConfirm}
        onConfirm={confirmRemove}
        onCancel={() => setShowRemoveConfirm(false)}
        isRemoving={isPending}
      />
    </>
  );
}

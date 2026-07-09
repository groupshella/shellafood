"use client";

import { memo, useCallback, useState } from "react";
import { CartItem } from "@/features/cart/types/cart.types";
import { useCartItem } from "@/features/cart/hooks/useCartItem";
import { RemoveProductConfirmSheet } from "@/features/cart/components/shared/RemoveProductConfirmSheet";
import { CartItemCard } from "./CartItemCard";

interface CartItemRowProps {
  item: CartItem;
}

export const CartItemRow = memo(function CartItemRow({ item }: CartItemRowProps) {
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const { item: liveItem, isPending, handleIncrease, handleDecrease, handleRemove } =
    useCartItem(item);

  const handleOpenRemove = useCallback(() => {
    setShowRemoveConfirm(true);
  }, []);

  const handleCancelRemove = useCallback(() => {
    setShowRemoveConfirm(false);
  }, []);

  const confirmRemove = useCallback(async () => {
    await handleRemove();
    setShowRemoveConfirm(false);
  }, [handleRemove]);

  return (
    <>
      <CartItemCard
        item={liveItem}
        isUpdating={isPending}
        onIncrease={handleIncrease}
        onDecrease={handleDecrease}
        onRemove={handleOpenRemove}
      />

      <RemoveProductConfirmSheet
        isOpen={showRemoveConfirm}
        onConfirm={confirmRemove}
        onCancel={handleCancelRemove}
        isRemoving={isPending}
      />
    </>
  );
});

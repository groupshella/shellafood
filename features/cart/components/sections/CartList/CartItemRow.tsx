"use client";

import { memo, useCallback, useEffect, useRef, useState } from "react";
import { CartItem } from "@/features/cart/types/cart.types";
import { useProductCart } from "@/features/cart/hooks/useProductCart";
import { RemoveProductConfirmSheet } from "@/features/cart/components/shared/RemoveProductConfirmSheet";
import { useNotification } from "@/shared/components/NotificationToast";
import { CartItemCard } from "./CartItemCard";

interface CartItemRowProps {
  item: CartItem;
}

export const CartItemRow = memo(function CartItemRow({ item }: CartItemRowProps) {
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const { error: notifyError } = useNotification();
  const lastNotifiedError = useRef<string | null>(null);
  const { item: liveItem, isPending, error, handleIncrease, handleDecrease, handleRemove } =
    useProductCart(item);

  useEffect(() => {
    if (error && error !== lastNotifiedError.current) {
      notifyError(error);
      lastNotifiedError.current = error;
    }
    if (!error) lastNotifiedError.current = null;
  }, [error, notifyError]);

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

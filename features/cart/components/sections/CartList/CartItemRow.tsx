"use client";

import { memo, useCallback, useEffect, useRef, useState } from "react";
import { CartItem } from "@/features/cart/types/cart.types";
import { useProductCart } from "@/features/cart/hooks/useProductCart";
import { RemoveProductConfirmSheet } from "@/features/cart/components/shared/RemoveProductConfirmSheet";
import { useNotification } from "@/shared/components/NotificationToast";
import { CartItemCard } from "./CartItemCard";

interface CartItemRowProps {
  item: CartItem;
  isArabic: boolean;
}

export const CartItemRow = memo(function CartItemRow({ item, isArabic }: CartItemRowProps) {
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const { error: notifyError } = useNotification();
  const lastNotifiedError = useRef<string | null>(null);
  const wasPendingRef = useRef(false);
  const { item: liveItem, isPending, error, handleIncrease, handleDecrease, handleRemove } =
    useProductCart(item);

  useEffect(() => {
    const justFinished = wasPendingRef.current && !isPending;
    wasPendingRef.current = isPending;

    if (!error) {
      lastNotifiedError.current = null;
      return;
    }

    if (justFinished && error !== lastNotifiedError.current) {
      notifyError(error);
      lastNotifiedError.current = error;
    }
  }, [error, isPending, notifyError]);

  const handleOpenRemove = useCallback(() => {
    setShowRemoveConfirm(true);
  }, []);

  const handleCancelRemove = useCallback(() => {
    setShowRemoveConfirm(false);
  }, []);

  const handleDecreaseClick = useCallback(() => {
    if (liveItem.quantity <= 1) {
      setShowRemoveConfirm(true);
      return;
    }
    handleDecrease();
  }, [handleDecrease, liveItem.quantity]);

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
        onDecrease={handleDecreaseClick}
        onRemove={handleOpenRemove}
        isArabic={isArabic}
      />

      <RemoveProductConfirmSheet
        isOpen={showRemoveConfirm}
        onConfirm={confirmRemove}
        onCancel={handleCancelRemove}
        isRemoving={isPending}
        isArabic={isArabic}
      />
    </>
  );
});

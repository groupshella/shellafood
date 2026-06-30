"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { CartItem } from "@/features/cart/types/cart.types";
import { updateCart } from "@/features/cart/actions/update-cart";
import { removeCartItem } from "@/features/cart/actions/remove-cart-item";
import { clearCart } from "@/features/cart/actions/clear-cart";
import { PriceTag } from "@/features/home/components/shared/PriceTag";
import { CartItemCard } from "./CartItemCard";
import { CartEmpty } from "./CartEmpty";
import { ClearCartConfirmSheet } from "../../shared/ClearCartConfirmSheet";

interface CartListClientProps {
  items: CartItem[];
}

export function CartListClient({ items: initialItems }: CartListClientProps) {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [isPending, startTransition] = useTransition();
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  function handleMutation(
    cartId: number,
    action: () => Promise<{ success: boolean; items?: CartItem[]; message?: string }>
  ) {
    setError(null);
    setUpdatingId(cartId);

    startTransition(async () => {
      const result = await action();

      if (result.success && result.items) {
        setItems(result.items);
        router.refresh();
      } else if (result.message) {
        setError(result.message);
      }

      setUpdatingId(null);
    });
  }

  function handleIncrease(cartId: number, quantity: number) {
    handleMutation(cartId, () => updateCart({ cart_id: cartId, quantity: quantity + 1 }));
  }

  function handleDecrease(cartId: number, quantity: number) {
    if (quantity <= 1) {
      handleMutation(cartId, () => removeCartItem(cartId));
      return;
    }

    handleMutation(cartId, () => updateCart({ cart_id: cartId, quantity: quantity - 1 }));
  }

  function handleClearCart() {
    setShowClearConfirm(false);
    setError(null);

    startTransition(async () => {
      const result = await clearCart();

      if (result.success) {
        setItems([]);
        router.refresh();
      } else if (result.message) {
        setError(result.message);
      }
    });
  }

  if (items.length === 0) {
    return <CartEmpty />;
  }

  return (
    <>
      <div className="flex flex-1 flex-col px-4 pb-36 pt-3">
        <div className="mb-3 flex justify-end">
          <button
            type="button"
            onClick={() => setShowClearConfirm(true)}
            disabled={isPending}
            className="flex items-center gap-1.5 text-xs font-medium text-red-500 transition-colors active:text-red-600 disabled:opacity-50"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>تفريغ السلة</span>
          </button>
        </div>

        {error && (
          <p className="mb-3 rounded-xl bg-red-50 px-3 py-2 text-center text-xs text-red-600">
            {error}
          </p>
        )}

        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <CartItemCard
              key={item.id}
              item={item}
              isUpdating={isPending && updatingId === item.id}
              onIncrease={() => handleIncrease(item.id, item.quantity)}
              onDecrease={() => handleDecrease(item.id, item.quantity)}
            />
          ))}
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-10 border-t border-gray-100 bg-white px-4 pb-6 pt-3">
        <div className="mb-3 flex items-center justify-between rounded-2xl bg-gray-100 px-4 py-3">
          <span className="text-sm font-medium text-gray-600">إجمالي المنتجات</span>
          <PriceTag amount={total} className="text-base font-bold text-gray-900" />
        </div>

        <button
          type="button"
          onClick={() => router.push("/checkout")}
          className="w-full rounded-2xl bg-[#30913F] py-4 text-sm font-semibold text-white transition-colors active:bg-[#267332] disabled:cursor-not-allowed disabled:opacity-60"
          disabled={items.length === 0 || isPending}
        >
          الدفع
        </button>
      </div>

      <ClearCartConfirmSheet
        isOpen={showClearConfirm}
        onConfirm={handleClearCart}
        onCancel={() => setShowClearConfirm(false)}
        isClearing={isPending}
      />
    </>
  );
}

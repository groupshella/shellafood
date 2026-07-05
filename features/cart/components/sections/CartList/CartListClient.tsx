"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { useCart } from "@/features/cart/context/CartContext";
import { PriceTag } from "@/features/home/components/shared/PriceTag";
import { CartItemRow } from "./CartItemRow";
import { CartEmpty } from "./CartEmpty";
import { ClearCartConfirmSheet } from "../../shared/ClearCartConfirmSheet";

export function CartListClient() {
  const router = useRouter();
  const { items, clearAllProducts } = useCart();
  const [isClearing, setIsClearing] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  async function handleClearCart() {
    setShowClearConfirm(false);
    setError(null);
    setIsClearing(true);

    const result = await clearAllProducts();

    if (!result.success && result.message) {
      setError(result.message);
    }

    setIsClearing(false);
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
            disabled={isClearing}
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
            <CartItemRow key={item.id} item={item} />
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
          disabled={items.length === 0 || isClearing}
        >
          الدفع
        </button>
      </div>

      <ClearCartConfirmSheet
        isOpen={showClearConfirm}
        onConfirm={handleClearCart}
        onCancel={() => setShowClearConfirm(false)}
        isClearing={isClearing}
      />
    </>
  );
}

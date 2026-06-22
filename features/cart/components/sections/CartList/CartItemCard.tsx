import Image from "next/image";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { PriceTag } from "@/features/home/components/shared/PriceTag";
import { CartItem } from "@/features/cart/types/cart.types";

interface CartItemCardProps {
  item: CartItem;
  onIncrease: () => void;
  onDecrease: () => void;
  isUpdating?: boolean;
}

export function CartItemCard({
  item,
  onIncrease,
  onDecrease,
  isUpdating = false,
}: CartItemCardProps) {
  const discounted = item.discount > 0;

  return (
    <div
      className={[
        "flex gap-3 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm",
        isUpdating ? "pointer-events-none opacity-60" : "",
      ].join(" ")}
    >
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-[#F7F9F7]">
        {item.image_full_url ? (
          <Image
            src={item.image_full_url}
            alt={item.name}
            fill
            className="object-contain p-2"
            sizes="80px"
          />
        ) : (
          <div className="flex h-full items-center justify-center opacity-20">
            <ShoppingBag className="h-8 w-8 text-gray-400" />
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <h3 className="truncate text-sm font-semibold text-gray-900">{item.name}</h3>
        {item.description?.trim() && (
          <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-gray-500">
            {item.description}
          </p>
        )}

        <div className="mt-2 flex items-end justify-between gap-2">
          <div className="flex items-end gap-1.5">
            {discounted && (
              <span className="mb-0.5 rounded-md bg-[#E53935] px-1.5 py-0.5 text-[10px] font-bold text-white">
                -{item.discount}%
              </span>
            )}
            <PriceTag amount={item.price} size="sm" className="text-sm font-bold text-[#2F8F3B]" />
          </div>

          <div className="flex items-center gap-2 rounded-full border border-gray-200 px-2 py-1">
            <button
              type="button"
              onClick={onDecrease}
              className="flex h-7 w-7 items-center justify-center rounded-full text-gray-600 transition-colors active:bg-gray-100"
              aria-label="تقليل الكمية"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="min-w-[1.5rem] text-center text-sm font-bold text-gray-900">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={onIncrease}
              className="flex h-7 w-7 items-center justify-center rounded-full text-gray-600 transition-colors active:bg-gray-100"
              aria-label="زيادة الكمية"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

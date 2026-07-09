import { memo } from "react";
import Image from "next/image";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { formatPrice } from "@/features/home/components/shared/PriceTag";
import { CartItem } from "@/features/cart/types/cart.types";

interface CartItemCardProps {
  item: CartItem;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
  isUpdating?: boolean;
}

function extractWeight(text: string): string | null {
  const match = text.match(/\d+(?:[.,]\d+)?\s*(?:كجم|كغ|كيلو|جرام|غ|مل|لتر)/);
  return match?.[0] ?? null;
}

function getOriginalPrice(price: number, discount: number): number | null {
  if (discount <= 0) return null;
  return price / (1 - discount / 100);
}

function CurrencyIcon({ size }: { size: "sm" | "md" }) {
  const dimensions = size === "sm" ? 7.36 : 13;

  return (
    <svg
      width={dimensions}
      height={dimensions}
      viewBox="0 0 17 17"
      fill="none"
      className="shrink-0"
      aria-hidden
    >
      <path
        d="M16.0557 13.835C15.9558 14.6423 15.9119 14.9924 15.5391 15.7793L9.8125 16.9619C9.94413 16.1112 10.1191 15.4552 10.4043 15.0615L16.0557 13.835ZM8.0791 8.26465L9.79004 7.89355V2.4873C10.4276 1.7717 10.8195 1.4501 11.5889 1.04395V7.50391L16.0557 6.53418C15.9558 7.34162 15.9118 7.69164 15.5391 8.47852L11.5889 9.31348V11.1299L16.0557 10.1846C15.9558 10.9922 15.9121 11.3426 15.5391 12.1299L11.5889 12.9443V12.9619L9.79004 13.334V9.69336L8.0791 10.0547V12.3496L8.04883 12.3555C7.65527 13.0455 7.09989 13.8744 6.56445 14.5361L0.944336 15.6064C0.994737 14.8834 1.09981 14.4763 1.42676 13.748L6.2793 12.6953V10.4355L1.78125 11.3877C1.83165 10.6645 1.93761 10.2568 2.26465 9.52832L6.2793 8.65527V1.48145C6.91693 0.765707 7.30944 0.444342 8.0791 0.0380859V8.26465Z"
        fill="currentColor"
      />
    </svg>
  );
}

export const CartItemCard = memo(function CartItemCard({
  item,
  onIncrease,
  onDecrease,
  onRemove,
  isUpdating = false,
}: CartItemCardProps) {
  const originalPrice = getOriginalPrice(item.price, item.discount);
  const weight = item.description?.trim() ? extractWeight(item.description) : null;

  return (
    <div className="flex min-w-0 items-start gap-2.5 sm:gap-3">
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-50 dark:bg-gray-800 sm:h-[88px] sm:w-[88px] md:h-24 md:w-24">
        {item.image_full_url ? (
          <Image
            src={item.image_full_url}
            alt={item.name}
            fill
            className="object-contain p-1.5 sm:p-2"
            sizes="(max-width: 640px) 80px, (max-width: 768px) 88px, 96px"
          />
        ) : (
          <div className="flex h-full items-center justify-center opacity-30">
            <ShoppingBag className="h-7 w-7 text-gray-400 dark:text-gray-500 sm:h-8 sm:w-8" aria-hidden />
          </div>
        )}
      </div>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-2 sm:gap-2.5">
        <div className="flex w-full items-start justify-between gap-2 sm:gap-3">
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <h3 className="line-clamp-2 w-full text-start text-sm font-bold leading-snug text-gray-900 dark:text-gray-50 sm:text-[15px]">
              {item.name}
            </h3>
            {item.description?.trim() && !weight && (
              <p className="line-clamp-1 w-full text-start text-xs font-medium leading-snug text-gray-500 dark:text-gray-400 sm:text-[13px]">
                {item.description}
              </p>
            )}
            {weight && (
              <p className="text-start text-xs font-medium text-gray-500 dark:text-gray-400 sm:text-[13px]">
                {weight}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onRemove}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-1 active:bg-gray-100 active:text-red-500 dark:text-gray-500 dark:focus-visible:ring-offset-gray-900 dark:active:bg-gray-800 dark:active:text-red-400 sm:h-10 sm:w-10"
            aria-label={`حذف ${item.name}`}
          >
            <Trash2 className="h-4 w-4 sm:h-[18px] sm:w-[18px]" strokeWidth={1.5} aria-hidden />
          </button>
        </div>

        <div className="flex w-full flex-wrap items-center justify-between gap-2 sm:gap-3">
          <div className="flex flex-col items-start gap-0.5">
            {originalPrice != null && (
              <span className="flex items-center gap-[2px] text-[10px] font-medium text-gray-400 line-through dark:text-gray-500 sm:text-[11px]">
                <CurrencyIcon size="sm" />
                {formatPrice(originalPrice)}
              </span>
            )}
            <span className="flex items-center gap-1 text-sm font-bold text-gray-900 dark:text-gray-50 sm:text-[15px]">
              <CurrencyIcon size="md" />
              {formatPrice(item.price)}
            </span>
          </div>

          <div
            className={[
              "flex items-center gap-1 rounded-full border px-1.5 py-1 transition-opacity duration-200 sm:gap-1.5 sm:px-2",
              "border-gray-200 dark:border-gray-700",
              isUpdating ? "opacity-60" : "opacity-100",
            ].join(" ")}
          >
            <button
              type="button"
              onClick={onDecrease}
              className="flex h-8 w-8 items-center justify-center rounded-full text-gray-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-1 active:bg-gray-100 dark:text-gray-400 dark:focus-visible:ring-offset-gray-900 dark:active:bg-gray-800 sm:h-9 sm:w-9"
              aria-label="تقليل الكمية"
            >
              <Minus className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden />
            </button>
            <span className="min-w-[1.75rem] text-center text-sm font-bold text-gray-900 dark:text-gray-50 sm:min-w-8 sm:text-[15px]">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={onIncrease}
              className="flex h-8 w-8 items-center justify-center rounded-full text-gray-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-1 active:bg-gray-100 dark:text-gray-400 dark:focus-visible:ring-offset-gray-900 dark:active:bg-gray-800 sm:h-9 sm:w-9"
              aria-label="زيادة الكمية"
            >
              <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

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

export function CartItemCard({
  item,
  onIncrease,
  onDecrease,
  onRemove,
  isUpdating = false,
}: CartItemCardProps) {
  const originalPrice = getOriginalPrice(item.price, item.discount);
  const weight = item.description?.trim() ? extractWeight(item.description) : null;

  return (
    <div className="flex h-[90px] items-end gap-[11px]">
      <div className="relative h-[90px] w-[90px] shrink-0 overflow-hidden rounded-lg bg-[#F6F5F8]">
        {item.image_full_url ? (
          <Image
            src={item.image_full_url}
            alt={item.name}
            fill
            className="object-contain p-2"
            sizes="90px"
          />
        ) : (
          <div className="flex h-full items-center justify-center opacity-20">
            <ShoppingBag className="h-8 w-8 text-gray-400" />
          </div>
        )}
      </div>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col items-end gap-1">
        <div className="flex w-full items-start justify-between gap-[17px]">
          <div className="flex min-w-0 flex-1 flex-col items-end gap-[3px]">
            <h3 className="w-full truncate text-end text-[14px] font-bold leading-[140%] text-[#111B18]">
              {item.name}
            </h3>
            {item.description?.trim() && (
              <p className="w-full truncate text-end text-[14px] font-medium leading-[140%] text-[#555555]">
                {item.description}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onRemove}
            className="flex h-[18px] w-[18px] shrink-0 items-center justify-center text-[#555555] transition-opacity active:opacity-70"
            aria-label="حذف المنتج"
          >
            <Trash2 className="h-[18px] w-[18px]" strokeWidth={1.25} />
          </button>
        </div>

        <div className="flex w-full items-start justify-between gap-[37px]">
          <div className="flex min-w-0 flex-col items-end gap-[3px]">
            {weight && (
              <span className="w-full truncate text-end text-[14px] font-medium leading-[140%] text-[#555555]">
                {weight}
              </span>
            )}

            <div className="flex items-center justify-end gap-[2.36px]">
              {originalPrice != null && (
                <span className="flex items-center gap-[2.85px] text-[9px] font-medium leading-[120%] text-[#707784] line-through">
                  <CurrencyIcon size="sm" />
                  {formatPrice(originalPrice)}
                </span>
              )}
              <span className="flex items-center gap-[2.36px] text-[14px] font-bold leading-[120%] text-[#111B18]">
                <CurrencyIcon size="md" />
                {formatPrice(item.price)}
              </span>
            </div>
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
            <span
              className={[
                "min-w-[1.5rem] text-center text-sm font-bold text-gray-900 transition-opacity duration-200",
                isUpdating ? "opacity-70" : "opacity-100",
              ].join(" ")}
            >
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

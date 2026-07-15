"use client";

import Link from "next/link";
import { useCart } from "@/features/cart/context/CartContext";
import { PriceTag } from "@/features/home/components/shared/PriceTag";
import { CartItemRow } from "./CartItemRow";
import { CartEmpty } from "./CartEmpty";

const CONTENT_PADDING =
  "px-3 pb-40 pt-4 sm:px-4 sm:pb-44 sm:pt-5 md:px-5 lg:px-6 lg:pb-8 lg:pt-6";

const FOOTER_INNER =
  "px-3 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-3 sm:px-4 sm:pt-4 md:px-5";

const checkoutButtonClass = [
  "block w-full rounded-2xl bg-[#30913F] py-3.5 text-center text-sm font-semibold text-white shadow-sm",
  "transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2",
  "active:bg-[#267332] dark:focus-visible:ring-offset-gray-900",
  "sm:py-4 sm:text-[15px]",
  "md:hover:bg-[#267332]",
].join(" ");

function CartSummary({
  totalCount,
  totalPrice,
  elevated = false,
}: {
  totalCount: number;
  totalPrice: number;
  /** White summary chip for the desktop sidebar surface */
  elevated?: boolean;
}) {
  return (
    <>
      <div
        className={[
          "mb-3 flex items-center justify-between rounded-2xl px-3 py-3 sm:px-4 sm:py-3.5",
          elevated
            ? "mb-4 bg-white ring-1 ring-black/[0.05] dark:bg-gray-900 dark:ring-white/[0.06] lg:px-4 lg:py-4"
            : "bg-gray-50 dark:bg-gray-800",
        ].join(" ")}
      >
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400 sm:text-[15px]">
          إجمالي المنتجات
          <span className="ms-1 text-sm font-semibold text-gray-700 dark:text-gray-300 sm:text-[15px]">
            ({totalCount})
          </span>
        </span>
        <PriceTag
          amount={totalPrice}
          className="text-base font-bold text-gray-900 dark:text-gray-50 sm:text-lg"
        />
      </div>

      <Link href="/checkout" className={checkoutButtonClass}>
        الدفع
      </Link>
    </>
  );
}

export function CartListClient() {
  const { items, totalCount, totalPrice } = useCart();

  if (items.length === 0) {
    return <CartEmpty />;
  }

  return (
    <div className={`flex flex-1 flex-col lg:flex-row lg:items-start lg:gap-6 xl:gap-8 ${CONTENT_PADDING}`}>
      <ul
        className={[
          "mx-auto flex w-full max-w-3xl flex-col gap-0 divide-y divide-gray-100 dark:divide-gray-800",
          "lg:mx-0 lg:max-w-none lg:flex-1 lg:rounded-2xl lg:px-4 lg:ring-1 lg:ring-black/[0.06]",
          "dark:lg:ring-white/[0.08]",
          "xl:px-5",
        ].join(" ")}
        role="list"
        aria-label="منتجات السلة"
      >
        {items.map((item) => (
          <li key={item.id} className="py-4 first:pt-0 last:pb-0 sm:py-5 lg:first:pt-4 lg:last:pb-4">
            <CartItemRow item={item} />
          </li>
        ))}
      </ul>

      {/* Mobile / tablet: fixed checkout bar */}
      <div className="fixed inset-x-0 bottom-0 z-10 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.08)] dark:bg-gray-900 dark:shadow-[0_-4px_20px_rgba(0,0,0,0.4)] lg:hidden">
        <div className={`mx-auto max-w-lg sm:max-w-2xl md:max-w-3xl ${FOOTER_INNER}`}>
          <CartSummary totalCount={totalCount} totalPrice={totalPrice} />
        </div>
      </div>

      {/* Desktop: sticky order summary */}
      <aside
        className={[
          "hidden w-full shrink-0 lg:sticky lg:top-20 lg:block lg:w-[18.5rem] xl:w-[20.5rem]",
          "lg:rounded-2xl lg:bg-gray-50 lg:p-5 lg:ring-1 lg:ring-black/[0.05]",
          "dark:lg:bg-gray-800/60 dark:lg:ring-white/[0.06]",
        ].join(" ")}
        aria-label="ملخص الطلب"
      >
        <h2 className="mb-4 text-start text-base font-bold text-gray-900 dark:text-gray-50">
          ملخص الطلب
        </h2>
        <CartSummary totalCount={totalCount} totalPrice={totalPrice} elevated />
      </aside>
    </div>
  );
}

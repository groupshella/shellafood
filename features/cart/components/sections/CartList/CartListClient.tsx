"use client";

import Link from "next/link";
import { useCart } from "@/features/cart/context/CartContext";
import { PriceTag } from "@/features/home/components/shared/PriceTag";
import { CartItemRow } from "./CartItemRow";
import { CartEmpty } from "./CartEmpty";

const CONTENT_PADDING = "px-3 pb-40 pt-4 sm:px-4 sm:pb-44 sm:pt-5 md:px-5 lg:px-6";
const FOOTER_PADDING = "px-3 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-3 sm:px-4 sm:pt-4 md:px-5 lg:px-6";

const checkoutButtonClass =
  "block w-full rounded-2xl bg-[#30913F] py-3.5 text-center text-sm font-semibold text-white shadow-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2 active:bg-[#267332] dark:focus-visible:ring-offset-gray-900 sm:py-4 sm:text-[15px] lg:ms-auto lg:max-w-md";

export function CartListClient() {
  const { items, totalCount, totalPrice } = useCart();

  if (items.length === 0) {
    return <CartEmpty />;
  }

  return (
    <>
      <div className={`flex flex-1 flex-col bg-white dark:bg-gray-900 ${CONTENT_PADDING}`}>
        <ul
          className="mx-auto flex w-full max-w-3xl flex-col gap-0 divide-y divide-gray-100 dark:divide-gray-800 lg:max-w-4xl"
          role="list"
          aria-label="منتجات السلة"
        >
          {items.map((item) => (
            <li key={item.id} className="py-4 first:pt-0 last:pb-0 sm:py-5">
              <CartItemRow item={item} />
            </li>
          ))}
        </ul>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-10 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.08)] dark:bg-gray-900 dark:shadow-[0_-4px_20px_rgba(0,0,0,0.4)]">
        <div className={`mx-auto max-w-lg sm:max-w-2xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl ${FOOTER_PADDING}`}>
          <div className="mb-3 flex items-center justify-between rounded-2xl bg-gray-50 px-3 py-3 dark:bg-gray-800 sm:px-4 sm:py-3.5 lg:rounded-3xl">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400 sm:text-[15px]">
              إجمالي المنتجات
              <span className="ms-1 text-sm font-semibold text-gray-700 dark:text-gray-300 sm:text-[15px]">
                ({totalCount})
              </span>
            </span>
            <PriceTag amount={totalPrice} className="text-base font-bold text-gray-900 dark:text-gray-50 sm:text-lg" />
          </div>

          <Link href="/checkout" className={checkoutButtonClass}>
            الدفع
          </Link>
        </div>
      </div>
    </>
  );
}

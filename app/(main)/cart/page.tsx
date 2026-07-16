import { Suspense } from "react";
import type { Metadata } from "next";
import { CartShell } from "@/features/cart/components/CartShell";
import { CartList, skeleton as CartListSkeleton } from "@/features/cart/components/sections/CartList";
import { isArabicLocale } from "@/shared/lib/locale";

export async function generateMetadata(): Promise<Metadata> {
  const isArabic = await isArabicLocale();
  return {
    title: isArabic ? "السلة | شيلة فود" : "Cart | Shella Food",
    description: isArabic
      ? "راجع منتجات سلتك وأكمل طلبك"
      : "Review your cart items and complete your order",
  };
}

export default async function CartPage() {
  const isArabic = await isArabicLocale();

  return (
    <CartShell
      title={isArabic ? "سلة التسوق" : "Shopping cart"}
      isArabic={isArabic}
    >
      <Suspense fallback={<CartListSkeleton />}>
        <CartList />
      </Suspense>
    </CartShell>
  );
}

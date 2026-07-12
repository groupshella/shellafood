import { Suspense } from "react";
import type { Metadata } from "next";
import { CartShell } from "@/features/cart/components/CartShell";
import { CartList, skeleton as CartListSkeleton } from "@/features/cart/components/sections/CartList";
import { AuthRequiredScreen } from "@/features/layout/components/AuthRequiredScreen";
import { isAuthenticated } from "@/features/layout/lib/is-authenticated";
import { getServerLocale } from "@/features/language/getServerLocale";

export const metadata: Metadata = {
  title: "السلة | شيلة فود",
  description: "راجع منتجات سلتك وأكمل طلبك",
};

export default async function CartPage() {
  const locale = await getServerLocale()
  const isArabic = locale === "ar";

  return (
    <CartShell title={isArabic ? "السلة" : "Cart"} isArabic={isArabic}>
      <Suspense fallback={<CartListSkeleton />}>
        <CartList isArabic={isArabic} />
      </Suspense>
    </CartShell>
  );
}

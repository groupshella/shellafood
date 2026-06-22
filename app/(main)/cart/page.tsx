import { Suspense } from "react";
import type { Metadata } from "next";
import { CartShell } from "@/features/cart/components/CartShell";
import { CartList, skeleton as CartListSkeleton } from "@/features/cart/components/sections/CartList";

export const metadata: Metadata = {
  title: "السلة | شيلافود",
};

export default function CartPage() {
  return (
    <CartShell title="السلة">
      <Suspense fallback={<CartListSkeleton />}>
        <CartList />
      </Suspense>
    </CartShell>
  );
}

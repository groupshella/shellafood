import { Suspense } from "react";
import type { Metadata } from "next";
import { FavoritesShell } from "@/features/favorites/components/FavoritesShell";
import { ProductsTab } from "@/features/favorites/components/sections/ProductsTab";
import { StoresTab } from "@/features/favorites/components/sections/StoresTab";
import { OrdersTab } from "@/features/favorites/components/sections/OrdersTab";

export const metadata: Metadata = {
    title: "مفضلاتي | شلة فود",
};

export default function FavoritesPage() {
    return (
        <FavoritesShell
            productsContent={
                <Suspense fallback={<ProductsTab.skeleton />}>
                    <ProductsTab />
                </Suspense>
            }
            storesContent={
                <Suspense fallback={<StoresTab.skeleton />}>
                    <StoresTab />
                </Suspense>
            }
            ordersContent={
                <Suspense fallback={<OrdersTab.skeleton />}>
                    <OrdersTab />
                </Suspense>
            }
        />
    );
}

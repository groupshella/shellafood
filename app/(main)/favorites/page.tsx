import { Suspense } from "react";
import type { Metadata } from "next";
import { FavoritesShell } from "@/features/favorites/components/FavoritesShell";
import { ProductsTab } from "@/features/favorites/components/sections/ProductsTab";
import { StoresTab } from "@/features/favorites/components/sections/StoresTab";
import { OrdersTab } from "@/features/favorites/components/sections/OrdersTab";
import { AuthRequiredScreen } from "@/features/layout/components/AuthRequiredScreen";
import { isAuthenticated } from "@/features/layout/lib/is-authenticated";

export const metadata: Metadata = {
    title: "مفضلاتي | شلة فود",
};

export default async function FavoritesPage() {
    if (!(await isAuthenticated())) {
        return <AuthRequiredScreen page="favorites" />;
    }

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

import { Suspense } from "react";
import type { Metadata } from "next";
import { FavoritesShell } from "@/features/favorites/components/FavoritesShell";
import { ProductsTab } from "@/features/favorites/components/sections/ProductsTab";
import { StoresTab } from "@/features/favorites/components/sections/StoresTab";
import { OrdersTab } from "@/features/favorites/components/sections/OrdersTab";
import { AuthRequiredScreen } from "@/features/layout/components/AuthRequiredScreen";
import { isAuthenticated } from "@/features/layout/lib/is-authenticated";
import { getServerLocale } from "@/features/language/getServerLocale";

export const metadata: Metadata = {
    title: "مفضلاتي | شيلة فود",
    description: "المنتجات والمتاجر والطلبات المحفوظة في مفضلتك",
};

export default async function FavoritesPage() {
    if (!(await isAuthenticated())) {
        return <AuthRequiredScreen page="favorites" />;
    }

    const locale = await getServerLocale()
    const isArabic = locale === "ar";

    return (
        <FavoritesShell
            isArabic={isArabic}
            productsContent={
                <Suspense fallback={<ProductsTab.skeleton />}>
                    <ProductsTab isArabic={isArabic} />
                </Suspense>
            }
            storesContent={
                <Suspense fallback={<StoresTab.skeleton />}>
                    <StoresTab isArabic={isArabic} />
                </Suspense>
            }
            ordersContent={
                <Suspense fallback={<OrdersTab.skeleton />}>
                    <OrdersTab isArabic={isArabic} />
                </Suspense>
            }
        />
    );
}

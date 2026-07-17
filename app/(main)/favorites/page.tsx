import { Suspense } from "react";
import type { Metadata } from "next";
import { AddToCart } from "@/features/cart/components/shared/AddToCart";
import { FavoritesShell } from "@/features/favorites/components/FavoritesShell";
import { ProductsTab } from "@/features/favorites/components/sections/ProductsTab";
import { StoresTab } from "@/features/favorites/components/sections/StoresTab";
import { OrdersTab } from "@/features/favorites/components/sections/OrdersTab";
import { AuthRequiredScreen } from "@/features/layout/components/AuthRequiredScreen";
import { isAuthenticated } from "@/features/layout/lib/is-authenticated";
import { isArabicLocale } from "@/shared/lib/locale";
import { getCart } from "@/features/cart/api/cart";

const MODULE_ID = process.env.MODULE_ID ?? "3";

export async function generateMetadata(): Promise<Metadata> {
    const isArabic = await isArabicLocale();
    return {
        title: isArabic ? "مفضلاتي | شيلة فود" : "My favorites | Shella Food",
        description: isArabic
            ? "المنتجات والمتاجر والطلبات المحفوظة في مفضلتك"
            : "Saved products, stores, and orders in your favorites",
    };
}

export default async function FavoritesPage() {
    const isArabic = await isArabicLocale();
    if (!(await isAuthenticated())) {
        return <AuthRequiredScreen page="favorites" isArabic={isArabic} />;
    }

    return (
        <>
            <FavoritesShell
                isArabic={isArabic}
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
        </>
    );
}

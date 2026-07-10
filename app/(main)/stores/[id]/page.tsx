import { Suspense } from "react";
import type { Metadata } from "next";
import { getStoreDetails } from "@/features/stores/api/store-details";
import { resolveStoreCategoryId } from "@/features/stores/types/store.types";
import { StoreShell } from "@/features/stores/components/StoreShell";
import { StoreHeader } from "@/features/stores/components/sections/StoreHeader";
import { StoreCategoryProducts } from "@/features/stores/components/sections/StoreCategoryProducts";
import { AddToCart } from "@/features/cart/components/shared/AddToCart";

interface StorePageProps {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ module_id?: string; categoryId?: string }>;
}

export const metadata: Metadata = {
    title: "تفاصيل المتجر | شلة فود",
    description: "تصفح منتجات المتجر واطلب الآن.",
};

export default async function StorePage({ params, searchParams }: StorePageProps) {
    const { id: storeId } = await params;
    const { module_id: moduleId = "3", categoryId } = await searchParams;

    const store = await getStoreDetails(storeId);
    const resolvedCategoryId = resolveStoreCategoryId(store, categoryId);

    return (
        <StoreShell>
            <StoreHeader
                store={store}
                storeId={storeId}
                moduleId={moduleId}
                activeCategoryId={resolvedCategoryId}
            />

            <Suspense key={resolvedCategoryId || "default"} fallback={<StoreCategoryProducts.skeleton />}>
                <StoreCategoryProducts
                    storeId={storeId}
                    moduleId={moduleId}
                    categoryId={resolvedCategoryId}
                    categoryProducts={store.category_products}
                    scrollIntoView={Boolean(categoryId)}
                />
            </Suspense>

            <AddToCart moduleId={moduleId} />
        </StoreShell>
    );
}

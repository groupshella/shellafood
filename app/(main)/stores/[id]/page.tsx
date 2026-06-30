import { Suspense } from "react";
import type { Metadata } from "next";
import { StoreShell } from "@/features/stores/components/StoreShell";
import { StoreHeader } from "@/features/stores/components/sections/StoreHeader";
import { StoreCategoryProducts } from "@/features/stores/components/sections/StoreCategoryProducts";

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

    return (
        <StoreShell>
            <Suspense fallback={<StoreHeader.skeleton />}>
                <StoreHeader
                    storeId={storeId}
                    moduleId={moduleId}
                    activeCategoryId={categoryId}
                />
            </Suspense>

            <Suspense key={categoryId ?? "default"} fallback={<StoreCategoryProducts.skeleton />}>
                <StoreCategoryProducts
                    storeId={storeId}
                    moduleId={moduleId}
                    categoryId={categoryId}
                />
            </Suspense>
        </StoreShell>
    );
}

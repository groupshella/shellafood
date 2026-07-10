"use client";

import { useEffect, useRef } from "react";
import { CategoryDetail } from "@/features/stores/types/store.types";
import { ProductCard } from "./ProductCard";

export const STORE_CATEGORY_PRODUCTS_ID = "store-category-products";

interface StoreCategoryProductsClientProps {
    detail: CategoryDetail;
    moduleId: string;
    scrollIntoView?: boolean;
}

const contentContainer =
    "mx-auto w-full px-3 pb-4 pt-2.5 sm:px-4 sm:pb-5 sm:pt-3 md:px-5 lg:max-w-4xl lg:px-6 xl:max-w-5xl 2xl:max-w-6xl";

export function StoreCategoryProductsClient({
    detail,
    moduleId,
    scrollIntoView = false,
}: StoreCategoryProductsClientProps) {
    const sectionRef = useRef<HTMLDivElement>(null);
    const allProducts = detail.sub_categories.flatMap((sc) => sc.products);

    useEffect(() => {
        if (!scrollIntoView) return;
        sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, [scrollIntoView, detail.category_id]);

    if (allProducts.length === 0) {
        return (
            <div
                id={STORE_CATEGORY_PRODUCTS_ID}
                ref={sectionRef}
                className={`flex flex-col items-center justify-center py-12 text-center sm:py-16 ${contentContainer}`}
            >
                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 sm:text-base">
                    لا توجد منتجات في هذا التصنيف
                </p>
            </div>
        );
    }

    return (
        <div id={STORE_CATEGORY_PRODUCTS_ID} ref={sectionRef} className={contentContainer}>
            {detail.sub_categories.map((sc) => {
                if (sc.products.length === 0) return null;
                return (
                    <section key={sc.id} className="mb-4 last:mb-0 sm:mb-5">
                        {detail.sub_categories.length > 1 && (
                            <h2 className="mb-2.5 text-start text-sm font-bold text-gray-900 dark:text-gray-50 sm:mb-3 sm:text-base">
                                {sc.name}
                            </h2>
                        )}

                        <div className="grid grid-cols-1 gap-2 sm:gap-2.5 md:grid-cols-2 md:gap-3 lg:gap-4">
                            {sc.products.map((product) => (
                                <ProductCard key={product.id} product={product} moduleId={moduleId} />
                            ))}
                        </div>
                    </section>
                );
            })}
        </div>
    );
}

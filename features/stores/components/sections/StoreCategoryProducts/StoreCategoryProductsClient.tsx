"use client";

import { CategoryDetail } from "@/features/stores/types/store.types";
import { ProductCard } from "./ProductCard";

interface StoreCategoryProductsClientProps {
    detail: CategoryDetail;
    moduleId: string;
}

export function StoreCategoryProductsClient({ detail, moduleId }: StoreCategoryProductsClientProps) {
    const allProducts = detail.sub_categories.flatMap((sc) => sc.products);

    if (allProducts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <p className="text-base font-semibold text-[#707784]">لا توجد منتجات في هذا التصنيف</p>
            </div>
        );
    }

    return (
        <div className="px-3 pb-4">
            {detail.sub_categories.map((sc) => {
                if (sc.products.length === 0) return null;
                return (
                    <section key={sc.id} className="mb-4">
                        {/* Sub-category heading */}
                        {detail.sub_categories.length > 1 && (
                            <h2 className="mb-2 text-right text-[15px] font-bold text-[#111B18]">
                                {sc.name}
                            </h2>
                        )}

                        {/* Product cards */}
                        <div className="flex flex-col gap-3">
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

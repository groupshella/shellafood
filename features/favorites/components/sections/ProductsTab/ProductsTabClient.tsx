"use client";

import { useState } from "react";
import { groupByDate } from "@/features/favorites/components/shared/dateGroups";
import { EmptyFavorites } from "@/features/favorites/components/shared/EmptyFavorites";
import { ProductCard } from "./ProductCard";
import type { FavoriteProduct } from "@/features/favorites/types/favorites.types";

const CONTENT_PADDING = "px-3 py-4 sm:px-4 sm:py-5 md:px-5 lg:px-6";
const ITEMS_GRID =
    "grid grid-cols-1 gap-2.5 md:grid-cols-2 md:gap-3 lg:gap-4 xl:grid-cols-3 xl:gap-4";
const SECTION_HEADING =
    "mb-2.5 text-start text-sm font-semibold text-gray-500 dark:text-gray-400 sm:mb-3 sm:text-[15px] md:text-base";

interface ProductsTabClientProps {
    products: FavoriteProduct[];
}

export function ProductsTabClient({ products: initialProducts }: ProductsTabClientProps) {
    const [products, setProducts] = useState(initialProducts);

    function handleRemove(itemId: number) {
        setProducts((prev) => prev.filter((p) => p.id !== itemId));
    }

    if (products.length === 0) {
        return <EmptyFavorites />;
    }

    const groups = groupByDate(products);

    return (
        <div className={`space-y-5 sm:space-y-6 ${CONTENT_PADDING}`}>
            {groups.map((group) => (
                <section key={group.key}>
                    <p className={SECTION_HEADING}>{group.label}</p>
                    <div className={ITEMS_GRID}>
                        {group.items.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                initialFavorited
                                onRemove={handleRemove}
                            />
                        ))}
                    </div>
                </section>
            ))}
        </div>
    );
}

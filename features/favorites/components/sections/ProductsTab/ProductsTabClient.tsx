// features/favorites/components/sections/ProductsTab/ProductsTabClient.tsx
"use client";

import { useState } from "react";
import { groupByDate } from "@/features/favorites/components/shared/dateGroups";
import { EmptyFavorites } from "@/features/favorites/components/shared/EmptyFavorites";
import { ProductCard } from "./ProductCard";
import type { FavoriteProduct } from "@/features/favorites/types/favorites.types";

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
        <div className="space-y-6 px-4 py-4">
            {groups.map((group) => (
                <section key={group.key}>
                    <p className="mb-2 text-right text-[13px] font-semibold text-[#707784]">
                        {group.label}
                    </p>
                    <div className="space-y-3">
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
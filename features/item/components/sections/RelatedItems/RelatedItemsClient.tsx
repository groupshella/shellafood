"use client";

import { RelatedItem } from "@/features/item/types/related-items.types";
import { RelatedProductCard } from "./RelatedProductCard";

interface RelatedItemsClientProps {
    items: RelatedItem[];
}

export function RelatedItemsClient({ items }: RelatedItemsClientProps) {
    return (
        <section className="bg-white px-4 pb-28 pt-5 sm:px-5" dir="rtl">
            <h2 className="mb-3 text-right text-base font-bold text-[#111B18] sm:text-lg">
                يُباع معها أيضاً
            </h2>

            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                {items.map((product) => (
                    <RelatedProductCard key={product.id} product={product} />
                ))}
            </div>
        </section>
    );
}

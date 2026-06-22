"use client";

import { ScrollContainer } from "@/features/home/components/shared/ScrollContainer";
import { RelatedItem } from "@/features/item/types/related-items.types";
import { RelatedProductCard } from "./RelatedProductCard";

interface RelatedItemsClientProps {
    items: RelatedItem[];
}

export function RelatedItemsClient({ items }: RelatedItemsClientProps) {
    return (
        <section className="mt-2 bg-white pb-8 pt-4">
            <h2 className="px-4 pb-3 text-sm font-bold text-gray-900 sm:px-5">منتجات قد تعجبك</h2>
            <div dir="ltr">
                <ScrollContainer className="gap-2 px-4 sm:px-5 flex flex-wrap">
                    {items.map((product) => (
                        <RelatedProductCard key={product.id} product={product} />
                    ))}
                </ScrollContainer>
            </div>
        </section>
    );
}

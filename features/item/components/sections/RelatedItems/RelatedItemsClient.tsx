"use client";

import { RelatedItem } from "@/features/item/types/related-items.types";
import { RelatedProductCard } from "./RelatedProductCard";

interface RelatedItemsClientProps {
    items: RelatedItem[];
    isArabic: boolean;
}

export function RelatedItemsClient({ items, isArabic }: RelatedItemsClientProps) {
    return (
        <section
            className="bg-white px-3 pt-5 dark:bg-gray-900 sm:px-5 md:pt-6 lg:px-6 pb-[calc(7rem+env(safe-area-inset-bottom))]"
            dir={isArabic ? "rtl" : "ltr"}
        >
            <h2 className="mb-3 text-start text-base font-bold text-gray-900 dark:text-gray-50 sm:mb-4 sm:text-lg md:text-xl">
                {isArabic ? "يُباع معها أيضاً" : "Also sold with"}
            </h2>

            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-2.5 md:grid-cols-5 md:gap-3 lg:grid-cols-6 lg:gap-4">
                {items.map((product) => (
                    <RelatedProductCard key={product.id} product={product} isArabic={isArabic} />
                ))}
            </div>
        </section>
    );
}

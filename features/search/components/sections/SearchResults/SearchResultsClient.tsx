"use client";

import Image from "next/image";
import { useSearchContext } from "@/features/search/components/SearchContext";
import { StoreCard } from "@/features/markets/components/sections/Stores/StoreCard";
import { SearchProductCard } from "./SearchProductCard";

export function SearchResultsClient() {
    const { results, isSearching, error, query } = useSearchContext();

    if (isSearching) {
        return (
            <div className="mt-8 space-y-6" aria-busy="true" aria-label="جاري البحث">
                <div className="space-y-3">
                    <div className="h-5 w-24 animate-pulse rounded bg-neutral-200" />
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {Array.from({ length: 4 }).map((_, index) => (
                            <div
                                key={index}
                                className="aspect-[3/4] animate-pulse rounded-xl bg-neutral-200"
                            />
                        ))}
                    </div>
                </div>
                <div className="space-y-3">
                    <div className="h-5 w-24 animate-pulse rounded bg-neutral-200" />
                    <div className="space-y-3">
                        {Array.from({ length: 3 }).map((_, index) => (
                            <div key={index} className="h-20 animate-pulse rounded-2xl bg-neutral-200" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="mt-8 rounded-2xl bg-red-50 px-4 py-6 text-center text-sm text-red-700">
                {error}
            </div>
        );
    }

    if (!results) return null;

    const products = results.items.products ?? [];
    const stores = results.stores.stores ?? [];
    const isEmpty = products.length === 0 && stores.length === 0;

    if (isEmpty) {
        return (
            <div className="mt-10 flex flex-col items-center gap-3 text-center">
                <div className="relative h-40 w-40">
                    <Image
                        src="/search/search-empty.png"
                        alt=""
                        fill
                        className="object-contain"
                        sizes="160px"
                    />
                </div>
                <p className="text-sm font-medium text-neutral-600">
                    لا توجد نتائج لـ &quot;{query}&quot;
                </p>
            </div>
        );
    }

    return (
        <div className="mt-8 flex flex-col gap-8">
            {stores.length > 0 && (
                <section aria-label="نتائج المتاجر" className="space-y-3">
                    <h2 className="text-base font-medium text-neutral-500">المتاجر</h2>
                    <div className="flex flex-col gap-3">
                        {stores.map((store) => (
                            <StoreCard key={store.id} store={store} />
                        ))}
                    </div>
                </section>
            )}

            {products.length > 0 && (
                <section aria-label="نتائج المنتجات" className="space-y-3">
                    <h2 className="text-base font-medium text-neutral-500">المنتجات</h2>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {products.map((product) => (
                            <SearchProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}

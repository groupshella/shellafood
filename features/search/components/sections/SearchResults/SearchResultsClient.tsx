"use client";

import { Loader2 } from "lucide-react";
import { useSearchContext } from "@/features/search/components/SearchContext";
import { StoreCard } from "@/features/markets/components/sections/Stores/StoreCard";
import { SearchProductCard } from "./SearchProductCard";
import { SearchEmptyState } from "./SearchEmptyState";

const SECTION_HEADING =
    "text-sm font-semibold text-gray-500 dark:text-gray-400 sm:text-base lg:text-lg";

const PRODUCTS_GRID =
    "grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 md:gap-3.5 lg:grid-cols-4 lg:gap-4 xl:grid-cols-5 2xl:grid-cols-6";

const STORES_GRID =
    "flex flex-col gap-2.5 sm:gap-3 md:grid md:grid-cols-2 md:gap-3.5 lg:gap-4";

export function SearchResultsClient() {
    const { results, isSearching, isLoadingMore, hasMore, loadMore, error, query } = useSearchContext();

    if (isSearching) {
        return (
            <div className="space-y-6 sm:space-y-8" aria-busy="true" aria-label="جاري البحث">
                <div className="space-y-3 sm:space-y-4">
                    <div className="h-5 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700 sm:h-6 sm:w-28" />
                    <div className={PRODUCTS_GRID}>
                        {Array.from({ length: 4 }).map((_, index) => (
                            <div
                                key={index}
                                className="aspect-[3/4] animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700 sm:rounded-2xl"
                            />
                        ))}
                    </div>
                </div>
                <div className="space-y-3 sm:space-y-4">
                    <div className="h-5 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700 sm:h-6 sm:w-28" />
                    <div className="space-y-2.5 sm:space-y-3">
                        {Array.from({ length: 3 }).map((_, index) => (
                            <div key={index} className="h-20 animate-pulse rounded-2xl bg-gray-200 dark:bg-gray-700 sm:h-[5.5rem]" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-2xl bg-red-50 px-4 py-5 text-center text-sm font-medium text-red-700 dark:bg-red-950/50 dark:text-red-400 sm:px-6 sm:py-6 sm:text-base">
                {error}
            </div>
        );
    }

    if (!results) return null;

    const products = results.items.products ?? [];
    const stores = results.stores.stores ?? [];
    const isEmpty = products.length === 0 && stores.length === 0;

    if (isEmpty) {
        return <SearchEmptyState query={query} />;
    }

    return (
        <div className="flex flex-col gap-6 sm:gap-8 lg:gap-10">
            {stores.length > 0 && (
                <section aria-label="نتائج المتاجر" className="space-y-3 sm:space-y-4">
                    <h2 className={SECTION_HEADING}>المتاجر</h2>
                    <div className={STORES_GRID}>
                        {stores.map((store) => (
                            <StoreCard key={store.id} store={store} />
                        ))}
                    </div>
                </section>
            )}

            {products.length > 0 && (
                <section aria-label="نتائج المنتجات" className="space-y-3 sm:space-y-4">
                    <h2 className={SECTION_HEADING}>المنتجات</h2>
                    <div className={PRODUCTS_GRID}>
                        {products.map((product) => (
                            <SearchProductCard key={product.id} product={product} />
                        ))}
                    </div>

                    {hasMore && (
                        <button
                            onClick={loadMore}
                            disabled={isLoadingMore}
                            className="mt-1 flex w-full items-center justify-center gap-2 rounded-2xl border border-[#30913F] py-3 text-sm font-semibold text-[#30913F] transition-colors active:bg-[#30913F]/5 disabled:cursor-not-allowed disabled:opacity-60 dark:border-[#4db860] dark:text-[#4db860] dark:active:bg-[#30913F]/10 sm:mx-auto sm:max-w-md sm:py-3.5 sm:text-[15px] md:max-w-lg lg:max-w-xl"
                        >
                            {isLoadingMore ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin sm:h-[18px] sm:w-[18px]" />
                                    <span>جاري التحميل...</span>
                                </>
                            ) : (
                                "عرض المزيد"
                            )}
                        </button>
                    )}
                </section>
            )}
        </div>
    );
}

const SECTION_PADDING = "px-3 sm:px-4 md:px-5 lg:px-6";

const PRODUCT_GRID =
    "grid grid-cols-1 gap-2 sm:gap-2.5 md:grid-cols-2 md:gap-3 lg:gap-4";

function ProductCardSkeleton() {
    return (
        <div className="flex h-full min-w-0 items-center gap-2.5 rounded-xl bg-white px-3 py-2.5 shadow-[0_2px_8px_rgba(0,0,0,0.07)] dark:bg-gray-800 sm:gap-3 sm:px-4 sm:py-3 md:rounded-2xl">
            <div className="h-16 w-16 shrink-0 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-700 sm:h-[72px] sm:w-[72px] md:h-20 md:w-20" />
            <div className="flex min-w-0 flex-1 flex-col gap-2">
                <div className="h-3.5 w-full animate-pulse rounded bg-gray-100 dark:bg-gray-700" />
                <div className="h-3 w-2/3 animate-pulse rounded bg-gray-100 dark:bg-gray-700" />
                <div className="h-3 w-1/3 animate-pulse rounded bg-gray-200 dark:bg-gray-600" />
            </div>
            <div className="flex flex-col gap-2 sm:gap-2.5">
                <div className="h-9 w-9 animate-pulse rounded-full bg-gray-100 dark:bg-gray-700 sm:h-10 sm:w-10" />
                <div className="h-9 w-9 animate-pulse rounded-full bg-gray-100 dark:bg-gray-700 sm:h-10 sm:w-10" />
            </div>
        </div>
    );
}

export function OfferItemsSearchLoading({ count = 4 }: { count?: number }) {
    return (
        <div
            className={`pt-2 sm:pt-3 ${SECTION_PADDING}`}
            aria-busy="true"
            aria-label="جارٍ البحث"
        >
            <div className={PRODUCT_GRID}>
                {Array.from({ length: count }).map((_, i) => (
                    <ProductCardSkeleton key={i} />
                ))}
            </div>
        </div>
    );
}

export default function OfferItemsSkeleton() {
    return (
        <section className="bg-[#F6F5F8] pb-[calc(7rem+env(safe-area-inset-bottom))] dark:bg-gray-950">
            <div className={`flex items-center justify-between bg-white py-2.5 dark:bg-gray-900 sm:py-3 ${SECTION_PADDING}`}>
                <div className="flex gap-2 sm:gap-2.5">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div
                            key={i}
                            className="h-10 w-10 animate-pulse rounded-[10px] bg-gray-100 dark:bg-gray-800 sm:h-9 sm:w-9"
                        />
                    ))}
                </div>
                <div className="h-4 w-24 animate-pulse rounded bg-gray-100 dark:bg-gray-800 sm:h-[18px] sm:w-28" />
            </div>

            <div className={`pt-2 sm:pt-3 ${SECTION_PADDING}`}>
                <div className={PRODUCT_GRID}>
                    {Array.from({ length: 6 }).map((_, i) => (
                        <ProductCardSkeleton key={i} />
                    ))}
                </div>
            </div>
        </section>
    );
}

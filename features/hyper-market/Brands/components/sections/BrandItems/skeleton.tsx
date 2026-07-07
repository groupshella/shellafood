function BrandItemCardSkeleton() {
    return (
        <div className="flex items-center gap-2.5 bg-white px-3 py-3 dark:bg-gray-900 sm:gap-3 sm:px-4 sm:py-3.5 md:rounded-2xl md:ring-1 md:ring-black/[0.04] md:dark:ring-white/[0.06]">
            <div className="h-16 w-16 shrink-0 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800 sm:h-[72px] sm:w-[72px]" />
            <div className="flex flex-1 flex-col gap-2">
                <div className="h-3.5 w-full animate-pulse rounded bg-gray-100 dark:bg-gray-800" />
                <div className="h-3 w-2/3 animate-pulse rounded bg-gray-100 dark:bg-gray-800" />
                <div className="h-3 w-1/3 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
            </div>
            <div className="flex flex-col gap-2">
                <div className="h-8 w-8 animate-pulse rounded-full bg-gray-100 dark:bg-gray-800" />
                <div className="h-8 w-8 animate-pulse rounded-full bg-gray-100 dark:bg-gray-800" />
            </div>
        </div>
    );
}

export function BrandItemsListLoading({ count = 4 }: { count?: number }) {
    return (
        <div
            className="flex flex-col divide-y divide-gray-100 bg-white dark:divide-gray-800 dark:bg-gray-900 md:grid md:grid-cols-2 md:gap-2.5 md:divide-y-0 md:bg-transparent md:px-5 md:pt-2.5 md:dark:bg-transparent lg:gap-3 lg:px-6"
            aria-busy="true"
            aria-label="جارٍ التحميل"
        >
            {Array.from({ length: count }).map((_, i) => (
                <BrandItemCardSkeleton key={i} />
            ))}
        </div>
    );
}

export default function BrandItemsSkeleton() {
    return (
        <section className="bg-[#F6F5F8] dark:bg-gray-950 pb-[calc(7rem+env(safe-area-inset-bottom))]">
            <div className="flex items-center justify-between bg-white px-3 py-2.5 dark:bg-gray-900 sm:px-5 lg:px-6">
                <div className="flex gap-2">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="h-9 w-9 animate-pulse rounded-[10px] bg-gray-100 dark:bg-gray-800" />
                    ))}
                </div>
                <div className="h-4 w-16 animate-pulse rounded bg-gray-100 dark:bg-gray-800" />
            </div>

            <div className="grid grid-cols-3 gap-2 px-3 pt-2 sm:grid-cols-4 sm:px-5 md:grid-cols-5 lg:px-6 xl:grid-cols-6">
                {Array.from({ length: 12 }).map((_, i) => (
                    <div
                        key={i}
                        className="flex flex-col overflow-hidden rounded-xl bg-white shadow-[0_2px_8px_rgba(0,0,0,0.07)] dark:bg-gray-800 dark:shadow-[0_2px_8px_rgba(0,0,0,0.2)]"
                    >
                        <div className="aspect-square w-full animate-pulse bg-gray-100 dark:bg-gray-700" />
                        <div className="space-y-1.5 px-2 py-2">
                            <div className="h-3 w-full animate-pulse rounded bg-gray-100 dark:bg-gray-700" />
                            <div className="h-3 w-3/4 animate-pulse rounded bg-gray-100 dark:bg-gray-700" />
                            <div className="h-3 w-1/2 animate-pulse rounded bg-gray-200 dark:bg-gray-600" />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

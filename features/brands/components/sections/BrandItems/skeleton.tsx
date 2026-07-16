function BrandItemCardSkeleton() {
    return (
        <div className="flex items-center gap-2.5 bg-background px-3 py-3 sm:gap-3 sm:px-4 sm:py-3.5 md:rounded-2xl md:ring-1 md:ring-border">
            <div className="h-16 w-16 shrink-0 animate-pulse rounded-xl bg-card sm:h-[72px] sm:w-[72px]" />
            <div className="flex flex-1 flex-col gap-2">
                <div className="h-3.5 w-full animate-pulse rounded bg-card" />
                <div className="h-3 w-2/3 animate-pulse rounded bg-card" />
                <div className="h-3 w-1/3 animate-pulse rounded bg-border" />
            </div>
            <div className="flex flex-col gap-2">
                <div className="h-8 w-8 animate-pulse rounded-full bg-card" />
                <div className="h-8 w-8 animate-pulse rounded-full bg-card" />
            </div>
        </div>
    );
}

export function BrandItemsListLoading({
    count = 4,
    isArabic = true,
}: {
    count?: number;
    isArabic?: boolean;
}) {
    return (
        <div
            className="flex flex-col divide-y divide-border bg-background md:grid md:grid-cols-2 md:gap-2.5 md:divide-y-0 md:bg-transparent md:px-5 md:pt-2.5 lg:grid-cols-3 lg:gap-3 lg:px-6"
            aria-busy="true"
            aria-label={isArabic ? "جارٍ التحميل" : "Loading"}
        >
            {Array.from({ length: count }).map((_, i) => (
                <BrandItemCardSkeleton key={i} />
            ))}
        </div>
    );
}

export default function BrandItemsSkeleton() {
    return (
        <section className="bg-background pb-[calc(7rem+env(safe-area-inset-bottom))]">
            <div className="flex items-center justify-between bg-background px-3 py-2.5 sm:px-5 lg:px-6">
                <div className="flex gap-2">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="h-9 w-9 animate-pulse rounded-[10px] bg-card" />
                    ))}
                </div>
                <div className="h-4 w-16 animate-pulse rounded bg-card" />
            </div>

            <div className="grid grid-cols-1 gap-2 px-3 pt-2 sm:px-5 md:grid-cols-2 md:gap-2.5 lg:grid-cols-3 lg:gap-3 lg:px-6">
                {Array.from({ length: 6 }).map((_, i) => (
                    <BrandItemCardSkeleton key={i} />
                ))}
            </div>
        </section>
    );
}

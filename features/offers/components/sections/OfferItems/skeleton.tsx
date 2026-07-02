function ProductCardSkeleton() {
    return (
        <div className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-[0_2px_8px_rgba(0,0,0,0.07)]">
            <div className="h-[72px] w-[72px] shrink-0 animate-pulse rounded-xl bg-gray-100" />
            <div className="flex flex-1 flex-col gap-2">
                <div className="h-3.5 w-full animate-pulse rounded bg-gray-100" />
                <div className="h-3 w-2/3 animate-pulse rounded bg-gray-100" />
                <div className="h-3 w-1/3 animate-pulse rounded bg-gray-200" />
            </div>
            <div className="flex flex-col gap-2">
                <div className="h-8 w-8 animate-pulse rounded-full bg-gray-100" />
                <div className="h-8 w-8 animate-pulse rounded-full bg-gray-100" />
            </div>
        </div>
    );
}

export function OfferItemsSearchLoading({ count = 4 }: { count?: number }) {
    return (
        <div
            className="flex flex-col gap-2 px-4 pt-2"
            aria-busy="true"
            aria-label="جارٍ البحث"
        >
            {Array.from({ length: count }).map((_, i) => (
                <ProductCardSkeleton key={i} />
            ))}
        </div>
    );
}

export default function OfferItemsSkeleton() {
    return (
        <section className="bg-[#F6F5F8] pb-28">
            <div className="flex items-center justify-between bg-white px-4 py-2.5">
                <div className="flex gap-2">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div
                            key={i}
                            className="h-9 w-9 animate-pulse rounded-[10px] bg-gray-100"
                        />
                    ))}
                </div>
                <div className="h-4 w-24 animate-pulse rounded bg-gray-100" />
            </div>

            <div className="flex flex-col gap-2 px-4 pt-2">
                {Array.from({ length: 6 }).map((_, i) => (
                    <ProductCardSkeleton key={i} />
                ))}
            </div>
        </section>
    );
}

const SECTION_PADDING = "px-3 sm:px-4 md:px-5 lg:px-6";

const PRODUCT_GRID =
    "grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-2.5 md:grid-cols-3 lg:grid-cols-4 lg:gap-3 xl:grid-cols-5";

function ProductCardSkeleton() {
    return (
        <div className="relative flex min-h-[172px] w-full min-w-0 flex-row items-center gap-2 overflow-hidden rounded-lg bg-card shadow-[0_7px_19.8px_rgba(0,0,0,0.04)] sm:min-h-[190px]">
            <div className="flex flex-1 flex-col items-end gap-2 self-stretch pb-2 pe-2 pt-2">
                <div className="h-14 w-14 animate-pulse rounded-xl bg-border sm:h-[60px] sm:w-[60px]" />
                <div className="flex w-full flex-col gap-3 px-1 sm:gap-4">
                    <div className="h-3.5 w-full animate-pulse rounded bg-border" />
                    <div className="h-3 w-2/3 animate-pulse rounded bg-border" />
                    <div className="h-3 w-1/3 animate-pulse rounded bg-border/70" />
                </div>
            </div>
            <div className="flex shrink-0 flex-col items-center justify-between gap-3 self-stretch p-0.5">
                <div className="h-9 w-9 animate-pulse rounded-full bg-border" />
                <div className="h-9 w-9 animate-pulse rounded-full bg-border" />
            </div>
        </div>
    );
}

export function OfferItemsSearchLoading({
    count = 6,
    isArabic = true,
}: {
    count?: number;
    isArabic?: boolean;
}) {
    return (
        <div
            className={`pt-2 sm:pt-3 ${SECTION_PADDING}`}
            aria-busy="true"
            aria-label={isArabic ? "جارٍ البحث" : "Searching"}
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
        <section className="bg-background pb-[calc(7rem+env(safe-area-inset-bottom))]">
            <div className={`flex items-center justify-between bg-background py-2.5 sm:py-3 ${SECTION_PADDING}`}>
                <div className="flex gap-2 sm:gap-2.5">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div
                            key={i}
                            className="h-10 w-10 animate-pulse rounded-[10px] bg-card sm:h-9 sm:w-9"
                        />
                    ))}
                </div>
                <div className="h-4 w-24 animate-pulse rounded bg-card sm:h-[18px] sm:w-28" />
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

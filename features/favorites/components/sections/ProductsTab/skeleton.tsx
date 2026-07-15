const CONTENT_PADDING = "px-3 py-4 sm:px-4 sm:py-5 md:px-5 lg:px-6";
const ITEMS_GRID =
    "grid grid-cols-1 gap-2.5 md:grid-cols-2 md:gap-3 lg:gap-4 xl:grid-cols-3 xl:gap-4";

export default function ProductsTabSkeleton() {
    return (
        <div className={`${CONTENT_PADDING}`}>
            <div className={ITEMS_GRID}>
                {Array.from({ length: 5 }).map((_, i) => (
                    <div
                        key={i}
                        className="flex h-full min-w-0 items-center gap-2.5 rounded-2xl bg-white px-3 py-2.5 shadow-sm ring-1 ring-black/[0.04] dark:bg-gray-800 dark:ring-white/[0.06] sm:gap-3 sm:px-4 sm:py-3"
                    >
                        <div className="h-16 w-16 shrink-0 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700 sm:h-[72px] sm:w-[72px]" />
                        <div className="min-w-0 flex-1 space-y-2">
                            <div className="h-4 w-4/5 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                            <div className="h-3 w-2/5 animate-pulse rounded bg-gray-100 dark:bg-gray-600" />
                            <div className="h-4 w-1/3 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                        </div>
                        <div className="flex shrink-0 flex-col gap-2 sm:gap-2.5">
                            <div className="h-9 w-9 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700 sm:h-10 sm:w-10" />
                            <div className="h-9 w-9 animate-pulse rounded-full bg-gray-100 dark:bg-gray-600 sm:h-10 sm:w-10" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

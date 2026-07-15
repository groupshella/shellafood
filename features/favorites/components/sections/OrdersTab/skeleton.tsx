const CONTENT_PADDING = "px-3 py-4 sm:px-4 sm:py-5 md:px-5 lg:px-6";
const ITEMS_GRID =
    "grid grid-cols-1 gap-2.5 md:grid-cols-2 md:gap-3 lg:gap-4 xl:grid-cols-3 xl:gap-4";

export default function OrdersTabSkeleton() {
    return (
        <div className={CONTENT_PADDING}>
            <div className={ITEMS_GRID}>
                {Array.from({ length: 4 }).map((_, i) => (
                    <div
                        key={i}
                        className="flex min-w-0 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/[0.04] dark:bg-gray-800 dark:ring-white/[0.06]"
                    >
                        <div className="w-16 shrink-0 animate-pulse rounded-l-2xl bg-gray-100 dark:bg-gray-700 sm:w-[4.5rem]" style={{ minHeight: "110px" }} />
                        <div className="flex min-w-0 flex-1 flex-col gap-2 px-3 py-3 sm:px-4 sm:py-3.5">
                            <div className="h-4 w-2/5 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                            <div className="h-3 w-3/5 animate-pulse rounded bg-gray-100 dark:bg-gray-600" />
                            <div className="h-5 w-16 animate-pulse rounded-full bg-gray-100 dark:bg-gray-600" />
                            <div className="h-3 w-4/5 animate-pulse rounded bg-gray-100 dark:bg-gray-600" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

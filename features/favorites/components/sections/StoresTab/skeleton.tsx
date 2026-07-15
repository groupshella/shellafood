const CONTENT_PADDING = "px-3 py-4 sm:px-4 sm:py-5 md:px-5 lg:px-6";
const ITEMS_GRID =
    "grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4 lg:gap-5 xl:grid-cols-3 xl:gap-5";

export default function StoresTabSkeleton() {
    return (
        <div className={CONTENT_PADDING}>
            <div className={ITEMS_GRID}>
                {Array.from({ length: 3 }).map((_, i) => (
                    <div
                        key={i}
                        className="min-w-0 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/[0.04] dark:bg-gray-800 dark:ring-white/[0.06] lg:rounded-3xl"
                    >
                        <div className="h-32 w-full animate-pulse bg-gray-200 dark:bg-gray-700 sm:h-36 md:h-40" />
                        <div className="flex items-center gap-2.5 px-3 py-3 sm:gap-3 sm:px-4 sm:py-3.5">
                            <div className="h-11 w-11 shrink-0 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700 sm:h-12 sm:w-12" />
                            <div className="min-w-0 flex-1 space-y-2">
                                <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                                <div className="h-3 w-1/3 animate-pulse rounded bg-gray-100 dark:bg-gray-600" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

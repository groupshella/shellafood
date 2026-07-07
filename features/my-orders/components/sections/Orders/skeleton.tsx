const SECTION_PADDING = "px-3 py-4 sm:px-4 sm:py-5 md:px-5 lg:px-6";

export default function OrdersSkeleton() {
    return (
        <div className={`space-y-3 sm:space-y-4 ${SECTION_PADDING}`}>
            <div className="flex gap-2 overflow-hidden pb-1 sm:gap-2.5">
                {[72, 88, 120, 80].map((w, i) => (
                    <div
                        key={i}
                        className="h-9 shrink-0 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700 sm:h-10"
                        style={{ width: w }}
                    />
                ))}
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4 lg:gap-5">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div
                        key={i}
                        className="rounded-2xl bg-white p-3.5 shadow-sm ring-1 ring-black/[0.04] dark:bg-gray-800 dark:ring-white/[0.06] sm:p-4"
                    >
                        <div className="mb-3 flex items-start justify-between gap-3">
                            <div className="flex-1 space-y-2">
                                <div className="h-4 w-3/5 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                                <div className="h-3 w-2/5 animate-pulse rounded bg-gray-100 dark:bg-gray-800" />
                            </div>
                            <div className="h-6 w-20 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
                        </div>
                        <div className="mb-3 h-3 w-4/5 animate-pulse rounded bg-gray-100 dark:bg-gray-800" />
                        <div className="flex justify-between border-t border-gray-100 pt-3 dark:border-gray-700">
                            <div className="h-3 w-14 animate-pulse rounded bg-gray-100 dark:bg-gray-800" />
                            <div className="h-4 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

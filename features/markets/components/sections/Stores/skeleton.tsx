export default function StoresSkeleton() {
    return (
        <div className="mx-auto w-full max-w-lg space-y-3 px-3 sm:max-w-2xl sm:px-5 lg:max-w-4xl lg:px-6 xl:max-w-5xl 2xl:max-w-6xl">
            <div className="h-5 w-40 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
            <div className="flex gap-2 overflow-hidden">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-8 w-20 shrink-0 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800" />
                ))}
            </div>
            <div className="grid grid-cols-1 gap-2.5 sm:gap-3 md:grid-cols-2 lg:gap-4">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div
                        key={i}
                        className="flex min-w-0 items-center gap-2.5 rounded-2xl bg-white p-2.5 ring-1 ring-black/[0.04] dark:bg-gray-800 dark:ring-white/[0.06] sm:gap-3 sm:p-3"
                    >
                        <div className="h-14 w-14 shrink-0 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-700 sm:h-[72px] sm:w-[72px]" />
                        <div className="flex-1 space-y-2">
                            <div className="h-4 w-2/3 animate-pulse rounded bg-gray-100 dark:bg-gray-700" />
                            <div className="h-3 w-1/2 animate-pulse rounded bg-gray-100 dark:bg-gray-700" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

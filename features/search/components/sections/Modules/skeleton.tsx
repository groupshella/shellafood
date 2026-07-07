export default function ModulesSkeleton() {
    return (
        <div className="space-y-3 sm:space-y-4">
            <div className="h-5 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700 sm:h-6 sm:w-28" />

            <div className="flex gap-2.5 overflow-hidden md:hidden sm:gap-3">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div
                        key={i}
                        className="h-12 w-32 shrink-0 animate-pulse rounded-2xl bg-gray-200 dark:bg-gray-700 sm:h-14 sm:w-36"
                    />
                ))}
            </div>

            <div className="hidden gap-3 md:grid md:grid-cols-3 lg:grid-cols-4 lg:gap-4 xl:grid-cols-5 2xl:grid-cols-6">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div
                        key={i}
                        className="h-12 animate-pulse rounded-2xl bg-gray-200 dark:bg-gray-700 sm:h-14"
                    />
                ))}
            </div>
        </div>
    );
}

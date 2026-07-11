export default function CategoriesSkeleton() {
    return (
        <div className="space-y-4 py-4 sm:py-5">
            <div className="mx-auto flex w-full max-w-lg items-center justify-between gap-3 px-3 sm:max-w-2xl sm:px-5 lg:max-w-4xl lg:px-6 xl:max-w-5xl 2xl:max-w-6xl">
                <div className="h-5 w-16 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800 sm:h-6 sm:w-20" />
                <div className="h-9 w-24 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800 sm:w-28" />
            </div>

            <div className="mx-auto flex w-full max-w-lg gap-3 overflow-hidden px-3 sm:max-w-2xl sm:px-5 lg:max-w-4xl lg:px-6 xl:max-w-5xl 2xl:max-w-6xl">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex w-[4.75rem] shrink-0 flex-col items-center gap-2 sm:w-[5.5rem] lg:w-24">
                        <div className="h-14 w-14 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800 sm:h-[72px] sm:w-[72px] md:h-20 md:w-20 lg:h-[88px] lg:w-[88px]" />
                        <div className="h-3 w-14 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                    </div>
                ))}
            </div>
        </div>
    );
}

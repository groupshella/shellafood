export default function RecentOrdersSkeleton() {
    return (
        <div className="mx-auto w-full max-w-lg space-y-3 px-3 sm:max-w-2xl sm:px-5 lg:max-w-4xl lg:px-6 xl:max-w-5xl 2xl:max-w-6xl">
            <div className="h-7 w-32 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800" />
            <div className="flex gap-3 overflow-hidden sm:gap-4">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex w-[4.75rem] shrink-0 flex-col items-center gap-2 sm:w-[5.5rem] lg:w-24">
                        <div className="h-14 w-14 animate-pulse rounded-2xl bg-gray-200 dark:bg-gray-800 sm:h-16 sm:w-16 lg:h-[72px] lg:w-[72px]" />
                        <div className="h-3 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                    </div>
                ))}
            </div>
        </div>
    );
}

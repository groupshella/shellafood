export default function AllCategoriesSkeleton() {
    return (
        <div className="min-h-dvh">
            <div className="flex min-h-[3.25rem] items-center justify-center border-b border-black/[0.04] px-3 py-2.5 dark:border-white/[0.06] sm:px-5">
                <div className="h-5 w-20 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800" />
            </div>

            <div className="mx-auto grid w-full max-w-lg grid-cols-2 gap-x-3 gap-y-5 px-3 pb-8 pt-5 sm:max-w-2xl sm:grid-cols-3 sm:gap-x-4 sm:gap-y-6 sm:px-5 md:grid-cols-4 lg:max-w-4xl lg:grid-cols-5 lg:gap-x-5 lg:gap-y-8 lg:px-6 xl:max-w-5xl xl:grid-cols-6 2xl:max-w-6xl">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="flex flex-col items-center gap-2.5">
                        <div className="h-14 w-14 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800 sm:h-[72px] sm:w-[72px] md:h-20 md:w-20 lg:h-[88px] lg:w-[88px]" />
                        <div className="h-3 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function PopularBrandsSkeleton() {
    return (
        <div className="mx-auto w-full max-w-lg space-y-3 px-3 sm:max-w-2xl sm:px-5 lg:max-w-4xl lg:px-6 xl:max-w-5xl 2xl:max-w-6xl">
            <div className="h-7 w-48 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800" />
            <div className="flex gap-2.5 overflow-hidden sm:gap-3">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div
                        key={i}
                        className="flex w-[43vw] min-w-[8.5rem] max-w-[13rem] shrink-0 flex-col gap-2.5 sm:w-[30vw] sm:min-w-[10rem] sm:max-w-[14rem] sm:gap-3 lg:w-[22vw] lg:max-w-[15rem] xl:w-[18vw]"
                    >
                        <div className="h-[68px] animate-pulse rounded-2xl bg-gray-200 dark:bg-gray-800 sm:h-[76px] lg:h-20" />
                        <div className="h-[68px] animate-pulse rounded-2xl bg-gray-200 dark:bg-gray-800 sm:h-[76px] lg:h-20" />
                    </div>
                ))}
            </div>
        </div>
    );
}

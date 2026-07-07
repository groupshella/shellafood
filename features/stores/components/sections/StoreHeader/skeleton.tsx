export default function StoreHeaderSkeleton() {
    return (
        <div className="animate-pulse bg-white dark:bg-gray-900">
            <div className="h-36 bg-green-800/60 dark:bg-gray-700 sm:h-40 md:h-48 lg:h-56 xl:h-60" />

            <div className="relative -mt-7 px-3 pb-2 sm:-mt-8 sm:px-4 md:px-5 lg:mx-auto lg:max-w-4xl lg:px-6 xl:max-w-5xl 2xl:max-w-6xl">
                <div className="flex items-start justify-between gap-2.5 sm:gap-3">
                    <div className="flex min-w-0 items-end gap-2 sm:gap-2.5">
                        <div className="h-[72px] w-[64px] shrink-0 rounded border-[3px] border-gray-100 bg-gray-200 dark:border-gray-800 dark:bg-gray-700 sm:h-[80px] sm:w-[72px] sm:border-4 md:h-[88px] md:w-[80px]" />
                        <div className="flex flex-col items-end gap-1.5 pb-0.5 sm:gap-2 sm:pb-1">
                            <div className="flex gap-1 sm:gap-1.5">
                                <div className="h-5 w-20 rounded bg-gray-100 dark:bg-gray-700 sm:h-[22px] sm:w-24" />
                                <div className="h-5 w-14 rounded bg-gray-100 dark:bg-gray-700 sm:h-[22px] sm:w-16" />
                            </div>
                            <div className="h-5 w-32 rounded bg-gray-200 dark:bg-gray-700 sm:w-36" />
                            <div className="h-4 w-40 rounded bg-gray-100 dark:bg-gray-600 sm:w-44" />
                        </div>
                    </div>
                    <div className="shrink-0 pt-7 sm:pt-9">
                        <div className="h-5 w-11 rounded-lg bg-gray-100 dark:bg-gray-700 sm:h-[22px] sm:w-12" />
                    </div>
                </div>
            </div>

            <div className="flex gap-1.5 px-3 pb-3 pt-3 sm:gap-2 sm:px-4 sm:pt-4 md:px-5 lg:mx-auto lg:max-w-4xl lg:px-6 xl:max-w-5xl 2xl:max-w-6xl">
                {[70, 120, 95, 68, 80].map((w, i) => (
                    <div
                        key={i}
                        className="h-8 shrink-0 rounded-lg bg-gray-100 dark:bg-gray-700 sm:h-9"
                        style={{ width: w }}
                    />
                ))}
            </div>
        </div>
    );
}

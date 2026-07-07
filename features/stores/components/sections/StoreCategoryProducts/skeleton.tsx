export default function StoreCategoryProductsSkeleton() {
    return (
        <div className="animate-pulse px-3 pb-4 pt-2.5 sm:px-4 sm:pb-5 sm:pt-3 md:px-5 lg:mx-auto lg:max-w-4xl lg:px-6 xl:max-w-5xl 2xl:max-w-6xl">
            <div className="mb-2.5 h-5 w-28 rounded bg-gray-200 dark:bg-gray-700 ms-auto sm:mb-3 sm:h-6 sm:w-32" />

            <div className="grid grid-cols-1 gap-2 sm:gap-2.5 md:grid-cols-2 md:gap-3 lg:gap-4">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div
                        key={i}
                        className="flex w-full min-w-0 items-center gap-2.5 rounded-2xl bg-white px-2.5 py-2.5 dark:bg-gray-800 sm:gap-3 sm:px-3 sm:py-3"
                    >
                        <div className="h-[72px] w-[72px] shrink-0 rounded-xl bg-gray-100 dark:bg-gray-700 sm:h-[80px] sm:w-[80px]" />

                        <div className="min-w-0 flex-1 space-y-2">
                            <div className="h-4 w-full rounded bg-gray-100 dark:bg-gray-700" />
                            <div className="h-4 w-3/4 rounded bg-gray-100 dark:bg-gray-700" />
                            <div className="h-4 w-16 rounded bg-gray-200 dark:bg-gray-600" />
                        </div>

                        <div className="flex shrink-0 flex-col gap-2.5 sm:gap-3">
                            <div className="h-9 w-9 rounded-full bg-gray-100 dark:bg-gray-700 sm:h-10 sm:w-10" />
                            <div className="h-9 w-9 rounded-full bg-gray-100 dark:bg-gray-700 sm:h-10 sm:w-10" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

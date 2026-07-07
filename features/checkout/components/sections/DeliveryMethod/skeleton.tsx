export default function DeliveryMethodSkeleton() {
    return (
        <div dir="rtl">
            <div className="mb-3 h-4 w-28 animate-pulse rounded bg-gray-200 dark:bg-gray-700 sm:h-[18px] sm:w-32" />
            <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2 md:gap-3">
                {Array.from({ length: 2 }).map((_, i) => (
                    <div
                        key={i}
                        className="flex min-h-[4.5rem] items-center justify-between rounded-xl border border-gray-200 bg-[#F6F5F8] p-3.5 dark:border-gray-700 dark:bg-gray-800 sm:min-h-20 sm:p-4"
                    >
                        <div className="space-y-1.5">
                            <div className="h-3.5 w-36 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                            <div className="h-3 w-20 animate-pulse rounded bg-gray-100 dark:bg-gray-600" />
                        </div>
                        <div className="h-5 w-5 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function InvoiceDetailsSkeleton() {
    return (
        <div dir="rtl">
            <div className="mb-3 h-4 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700 sm:h-[18px] sm:w-36" />
            <div className="rounded-2xl bg-[#F6F5F8] p-3.5 dark:bg-gray-800 sm:p-4 lg:rounded-3xl">
                <div className="space-y-3 sm:space-y-3.5">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="flex items-center justify-between gap-3">
                            <div className="h-3 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                            <div className="h-3 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                        </div>
                    ))}
                    <div className="border-t border-gray-200 pt-3 dark:border-gray-700 sm:pt-3.5">
                        <div className="flex items-center justify-between gap-3">
                            <div className="h-4 w-24 animate-pulse rounded bg-gray-300 dark:bg-gray-600" />
                            <div className="h-4 w-20 animate-pulse rounded bg-gray-300 dark:bg-gray-600" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

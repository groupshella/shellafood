export default function PaymentMethodSkeleton() {
    return (
        <div dir="rtl">
            <div className="mb-3 h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700 sm:h-[18px] sm:w-28" />
            <div className="flex gap-2 overflow-hidden sm:gap-3 md:grid md:grid-cols-3 md:gap-3">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div
                        key={i}
                        className="flex min-h-[5.5rem] min-w-[6.5rem] shrink-0 flex-col items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800 sm:min-h-24 sm:min-w-0"
                    >
                        <div className="h-6 w-6 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700" />
                        <div className="h-3 w-14 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                        <div className="h-2.5 w-10 animate-pulse rounded bg-gray-100 dark:bg-gray-600" />
                    </div>
                ))}
            </div>
        </div>
    );
}

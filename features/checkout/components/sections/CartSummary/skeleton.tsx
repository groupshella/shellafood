export default function CartSummarySkeleton() {
    return (
        <div dir="rtl">
            <div className="mb-3 h-4 w-40 animate-pulse rounded bg-gray-200 dark:bg-gray-700 sm:h-[18px] sm:w-48" />
            <div className="flex gap-2 overflow-hidden sm:gap-2.5">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div
                        key={i}
                        className="h-14 w-14 shrink-0 animate-pulse rounded-xl border border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-800 sm:h-16 sm:w-16"
                    />
                ))}
            </div>
        </div>
    );
}

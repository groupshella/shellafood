export default function DiscountCodeSkeleton() {
    return (
        <div dir="rtl">
            <div className="mb-3 h-4 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700 sm:h-[18px] sm:w-36" />
            <div className="flex flex-col gap-2 rounded-xl bg-[#F6F5F8] p-1.5 dark:bg-gray-800 sm:flex-row sm:items-center sm:p-2">
                <div className="h-11 flex-1 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700 sm:h-12" />
                <div className="h-11 w-full shrink-0 animate-pulse rounded-lg bg-gray-300 dark:bg-gray-600 sm:h-12 sm:w-20" />
            </div>
        </div>
    );
}

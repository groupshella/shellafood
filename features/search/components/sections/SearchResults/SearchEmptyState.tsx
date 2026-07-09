import Image from "next/image";

interface SearchEmptyStateProps {
    query?: string;
}

export function SearchEmptyState({ query: _query }: SearchEmptyStateProps = {}) {
    return (
        <div
            className="flex w-full flex-col items-center justify-center px-4 py-12 sm:px-6 sm:py-16 md:py-20 lg:py-24"
            role="status"
            aria-live="polite"
        >
            <div className="flex w-full max-w-xs flex-col items-center sm:max-w-sm" dir="rtl">
                <div className="relative aspect-square w-full max-w-[180px] sm:max-w-[200px] md:max-w-[260px]">
                    <Image
                        src="/search/search-empty.png"
                        alt="لا توجد نتائج مطابقة"
                        fill
                        priority={false}
                        className="object-contain"
                        sizes="(max-width: 640px) 180px, (max-width: 768px) 200px, 260px"
                    />
                </div>

                <h2 className="mt-5 text-center text-base font-bold text-gray-900 dark:text-gray-50 sm:mt-6 sm:text-lg md:text-xl">
                    لا توجد نتائج مطابقة
                </h2>

                <p className="mt-2 max-w-[280px] text-center text-sm leading-relaxed text-gray-500 dark:text-gray-400 sm:mt-2.5 sm:max-w-sm sm:text-[15px]">
                    جرّب البحث بكلمات أخرى أو استكشف الفئات المتاحة.
                </p>
            </div>
        </div>
    );
}

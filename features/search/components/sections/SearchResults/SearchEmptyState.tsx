import Image from "next/image";

interface SearchEmptyStateProps {
    query?: string;
}

export function SearchEmptyState({ query: _query }: SearchEmptyStateProps = {}) {
    return (
        <div
            className="flex w-full flex-col items-center justify-center px-6 py-16 md:py-20"
            role="status"
            aria-live="polite"
        >
            <div className="flex w-full max-w-[400px] flex-col items-center" dir="rtl">
                <div className="relative h-[220px] w-[220px] md:h-[280px] md:w-[280px] lg:h-[300px] lg:w-[300px]">
                    <Image
                        src="/search/search-empty.png"
                        alt=""
                        fill
                        priority={false}
                        className="object-contain"
                        sizes="(max-width: 768px) 220px, 300px"
                    />
                </div>

                <h2 className="mt-6 text-center text-base font-bold text-[#111B18] md:text-lg">
                    لا توجد نتائج مطابقة
                </h2>

                <p className="mt-2 max-w-[280px] text-center text-[13px] font-normal leading-[1.6] text-[#6B7280] md:max-w-[320px] md:text-sm">
                    جرّب البحث بكلمات أخرى أو استكشف الفئات المتاحة.
                </p>
            </div>
        </div>
    );
}

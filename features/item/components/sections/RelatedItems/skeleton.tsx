export default function RelatedItemsSkeleton() {
    return (
        <section className="bg-white px-3 pb-8 pt-5 dark:bg-gray-900 sm:px-5 md:pt-6 lg:px-6" dir="rtl">
            <div className="mb-3 h-5 w-36 animate-pulse rounded bg-gray-200 dark:bg-gray-700 sm:mb-4 sm:h-6" />
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-2.5 md:grid-cols-5 md:gap-3 lg:grid-cols-6 lg:gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div
                        key={i}
                        className="aspect-[3/4] animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800"
                    />
                ))}
            </div>
        </section>
    );
}

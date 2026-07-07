const BRANDS_GRID =
    "grid grid-cols-4 gap-2 sm:grid-cols-5 sm:gap-3 md:grid-cols-6 lg:grid-cols-8 lg:gap-4 xl:grid-cols-10";

export default function PopularBrandsSkeleton() {
    return (
        <div className="space-y-3 sm:space-y-4">
            <div className="h-5 w-40 animate-pulse rounded bg-gray-200 dark:bg-gray-700 sm:h-6 sm:w-48" />
            <div className={BRANDS_GRID}>
                {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className="aspect-square animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700 sm:rounded-2xl" />
                ))}
            </div>
        </div>
    );
}

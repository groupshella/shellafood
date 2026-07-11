export default function AllCategoriesSkeleton() {
    return (
        <div className="min-h-dvh">
            <div className="flex min-h-[3.25rem] items-center justify-center border-b border-black/[0.04] px-3 py-2.5 dark:border-white/[0.06] sm:px-5">
                <div className="h-5 w-20 animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800" />
            </div>

            <div className="grid grid-cols-3 gap-2 px-3 pb-6 pt-4 sm:gap-2.5 sm:px-4 md:grid-cols-4 lg:grid-cols-5 lg:gap-3 lg:px-6 xl:grid-cols-6">
                {Array.from({ length: 12 }).map((_, i) => (
                    <div
                        key={i}
                        className="aspect-[4/5] animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800"
                    />
                ))}
            </div>
        </div>
    );
}

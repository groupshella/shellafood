export default function AllBrandsSkeleton() {
    return (
        <div className="min-h-dvh bg-[#F5F5F5] dark:bg-gray-950">
            <div className="flex min-h-[3.25rem] items-center justify-center border-b border-black/[0.04] bg-white px-3 py-2.5 dark:border-white/[0.06] dark:bg-gray-900 sm:px-5">
                <div className="h-5 w-28 animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800" />
            </div>

            <div className="grid grid-cols-2 gap-2.5 px-3 pb-6 pt-4 sm:gap-3 sm:px-5 md:grid-cols-3 lg:grid-cols-4 lg:gap-4 lg:px-6 xl:grid-cols-5">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="h-[72px] animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800 sm:h-[76px]" />
                ))}
            </div>
        </div>
    );
}

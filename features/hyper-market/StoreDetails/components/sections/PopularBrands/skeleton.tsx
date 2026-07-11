export default function PopularBrandsSkeleton() {
    return (
        <section
            className="w-full bg-transparent px-3 pb-5 pt-3 sm:px-5 lg:px-6"
            dir="rtl"
            aria-hidden
        >
            <div className="mb-3 flex items-center justify-between gap-3">
                <div className="h-7 w-48 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800" />
                <div className="h-9 w-24 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800" />
            </div>
            <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
                <div className="h-[68px] animate-pulse rounded-2xl bg-gray-200 dark:bg-gray-800 sm:h-[76px]" />
                <div className="h-[68px] animate-pulse rounded-2xl bg-gray-200 dark:bg-gray-800 sm:h-[76px]" />
            </div>
        </section>
    );
}

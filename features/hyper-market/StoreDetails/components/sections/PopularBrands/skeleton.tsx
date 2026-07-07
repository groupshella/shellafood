export default function PopularBrandsSkeleton() {
    return (
        <section
            className="w-full bg-[#F5F5F5] px-3 pb-5 pt-3 dark:bg-gray-950 sm:px-5 lg:px-6"
            dir="rtl"
        >
            <div className="mb-3 h-7 w-48 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800" />
            <div className="flex gap-2.5 overflow-hidden sm:gap-3">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div
                        key={i}
                        className="flex w-[43vw] min-w-[8.5rem] max-w-[13rem] shrink-0 flex-col gap-2 sm:w-[30vw] sm:min-w-[10rem] sm:max-w-[14rem] sm:gap-2.5 lg:w-[22vw] lg:max-w-[15rem] xl:w-[18vw]"
                    >
                        <div className="h-[68px] animate-pulse rounded-2xl bg-gray-200 dark:bg-gray-800 sm:h-[76px]" />
                        <div className="h-[68px] animate-pulse rounded-2xl bg-gray-200 dark:bg-gray-800 sm:h-[76px]" />
                    </div>
                ))}
            </div>
        </section>
    );
}

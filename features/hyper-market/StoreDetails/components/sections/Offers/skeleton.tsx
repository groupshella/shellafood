const SLIDE_CLASS = [
    "relative w-full overflow-hidden rounded-2xl",
    "aspect-[16/9] sm:aspect-[21/8] md:aspect-[21/7] lg:aspect-[21/6] xl:aspect-[21/5.5]",
].join(" ");

export default function OffersSkeleton() {
    return (
        <div className="w-full px-3 sm:px-5 lg:px-6">
            <div className="mb-3 h-6 w-36 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800 sm:mb-4" />
            <div className={`${SLIDE_CLASS} animate-pulse bg-gray-100 dark:bg-gray-800`} />
        </div>
    );
}

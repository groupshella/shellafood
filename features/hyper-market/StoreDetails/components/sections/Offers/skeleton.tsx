const SLIDE_CLASS = [
    "relative w-full overflow-hidden rounded-2xl sm:rounded-[1.25rem] md:rounded-3xl",
    "aspect-[343/148] sm:aspect-[680/168]",
].join(" ");

export default function OffersSkeleton() {
    return (
        <div className="w-full px-3 sm:px-5 lg:px-6">
            <div className="mb-3 h-6 w-36 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800 sm:mb-4" />
            <div className={`${SLIDE_CLASS} animate-pulse bg-gray-100 dark:bg-gray-800`} />
        </div>
    );
}

const SLIDE_CLASS = [
    "relative w-full overflow-hidden rounded-2xl sm:rounded-[1.25rem] md:rounded-3xl lg:rounded-[1.75rem] xl:rounded-[2rem]",
    "aspect-[343/148] sm:aspect-[680/168] md:aspect-[900/200] lg:aspect-[1100/230] xl:aspect-[1280/260] 2xl:aspect-[1536/300]",
].join(" ");

export default function OffersSkeleton() {
    return (
        <div className="w-full min-w-0 px-3 pb-2 sm:px-5 sm:pb-3 md:px-6 lg:px-6 lg:pb-4 xl:px-8 2xl:px-10">
            <div className="mb-3 h-6 w-36 animate-pulse rounded-lg bg-gray-200 sm:mb-4 sm:h-7 sm:w-40 md:mb-5 md:h-8 md:w-44 lg:h-8 xl:mb-6 xl:h-9 xl:w-52 dark:bg-gray-800" />
            <div className={`${SLIDE_CLASS} animate-pulse bg-gray-100 dark:bg-gray-800`} />
        </div>
    );
}

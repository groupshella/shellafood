const SLIDE_CLASS = [
    "relative w-full overflow-hidden rounded-2xl",
    "aspect-[16/9] sm:aspect-[21/8] md:aspect-[21/7] lg:aspect-[21/6] xl:aspect-[21/5.5]",
].join(" ");

export default function OffersSkeleton() {
    return (
        <div className="mx-auto w-full max-w-lg px-3 sm:max-w-2xl sm:px-5 lg:max-w-4xl lg:px-6 xl:max-w-5xl 2xl:max-w-6xl">
            <div className={`${SLIDE_CLASS} animate-pulse bg-gray-100 dark:bg-gray-800`} />
        </div>
    );
}

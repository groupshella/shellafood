const SLIDE_CLASS = [
    "relative w-full overflow-hidden rounded-2xl sm:rounded-[1.25rem] md:rounded-3xl",
    "aspect-[343/148] sm:aspect-[680/168]",
].join(" ");

export default function OffersSkeleton() {
    return (
        <div className="mx-auto w-full max-w-lg px-3 sm:max-w-2xl sm:px-5 lg:max-w-4xl lg:px-6 xl:max-w-5xl 2xl:max-w-6xl">
            <div className={`${SLIDE_CLASS} animate-pulse bg-gray-100 dark:bg-gray-800`} />
        </div>
    );
}

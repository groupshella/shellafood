const SLIDE_CLASS = [
    "relative w-full overflow-hidden rounded-2xl",
    "aspect-[16/9] sm:aspect-[21/8] md:aspect-[21/7] lg:aspect-[21/6]",
].join(" ");

export default function OffersSkeleton() {
    return (
        <div className="w-full px-4 sm:px-5">
            <div className={`${SLIDE_CLASS} animate-pulse bg-gray-100`} />
        </div>
    );
}

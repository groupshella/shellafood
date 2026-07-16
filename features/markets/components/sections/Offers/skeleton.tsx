const SLIDE_CLASS =
	"mx-auto aspect-[343/148] w-full max-w-lg rounded-2xl sm:max-w-2xl sm:aspect-[680/168] md:max-w-3xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl";

export default function OffersSkeleton() {
	return (
		<div className="mx-auto w-full max-w-lg px-3 sm:max-w-2xl sm:px-5 md:max-w-3xl lg:max-w-4xl lg:px-6 xl:max-w-5xl 2xl:max-w-6xl">
			<div className={`${SLIDE_CLASS} animate-pulse bg-card`} />
		</div>
	);
}

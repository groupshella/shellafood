export default function BannerSkeleton() {
	return (
		<div className="mx-auto w-full min-w-0">
			<div className="aspect-[21/9] w-full animate-pulse overflow-hidden rounded-xl bg-card sm:aspect-[21/8] sm:rounded-2xl md:aspect-[21/7] lg:aspect-[21/6] xl:aspect-[21/5.5]">
				<div className="h-full w-full bg-gradient-to-r from-card via-border to-card" />
			</div>
		</div>
	);
}

export default function AllCategoriesSkeleton() {
	return (
		<div className="min-h-dvh">
			<div className="sticky top-0 z-20 border-b border-border bg-background/95 px-3 py-3 sm:px-5">
				<div className="mx-auto flex h-10 w-full max-w-lg items-center justify-center sm:max-w-2xl md:max-w-3xl lg:max-w-4xl">
					<div className="h-5 w-20 animate-pulse rounded-lg bg-border" />
				</div>
			</div>
			<div className="mx-auto grid w-full max-w-lg grid-cols-2 gap-x-3 gap-y-5 px-3 pb-8 pt-5 sm:max-w-2xl sm:grid-cols-3 sm:px-5 md:max-w-3xl md:grid-cols-4 lg:max-w-4xl lg:grid-cols-5 xl:grid-cols-6">
				{Array.from({ length: 12 }).map((_, i) => (
					<div key={i} className="flex flex-col items-center gap-2">
						<div className="h-14 w-14 animate-pulse rounded-full bg-border sm:h-[72px] sm:w-[72px] md:h-20 md:w-20 lg:h-[88px] lg:w-[88px]" />
						<div className="h-3 w-20 animate-pulse rounded bg-border" />
					</div>
				))}
			</div>
		</div>
	);
}

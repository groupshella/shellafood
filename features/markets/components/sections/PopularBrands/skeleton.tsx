export default function PopularBrandsSkeleton() {
	return (
		<div className="w-full space-y-3 px-3 sm:px-5 lg:px-6">
			<div className="mx-auto h-7 w-48 max-w-lg animate-pulse rounded-lg bg-border sm:max-w-2xl md:max-w-3xl lg:max-w-4xl" />
			<div className="mx-auto flex w-full max-w-lg gap-2.5 overflow-hidden sm:max-w-2xl sm:gap-3 md:max-w-3xl lg:max-w-4xl">
				{Array.from({ length: 3 }).map((_, i) => (
					<div key={i} className="flex w-[43vw] min-w-[8.5rem] max-w-[13rem] shrink-0 flex-col gap-2.5">
						<div className="h-[68px] animate-pulse rounded-2xl bg-border sm:h-[76px] lg:h-20" />
						<div className="h-[68px] animate-pulse rounded-2xl bg-border sm:h-[76px] lg:h-20" />
					</div>
				))}
			</div>
		</div>
	);
}

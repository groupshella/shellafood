export default function CategoriesSkeleton() {
	return (
		<div className="w-full space-y-3 py-4 sm:space-y-4 sm:py-5">
			<div className="mx-auto flex w-full max-w-lg items-center justify-between gap-3 px-3 sm:max-w-2xl sm:px-5 md:max-w-3xl lg:max-w-4xl lg:px-6">
				<div className="h-5 w-16 animate-pulse rounded-lg bg-border sm:h-6 sm:w-20" />
				<div className="h-9 w-24 animate-pulse rounded-lg bg-border sm:w-28" />
			</div>
			<div className="mx-auto flex w-full max-w-lg gap-3 overflow-hidden px-3 sm:max-w-2xl sm:px-5 md:max-w-3xl lg:max-w-4xl lg:px-6">
				{Array.from({ length: 6 }).map((_, i) => (
					<div key={i} className="flex w-[5rem] shrink-0 flex-col items-center gap-2 sm:w-[5.75rem]">
						<div className="h-14 w-14 animate-pulse rounded-full bg-border sm:h-[72px] sm:w-[72px] md:h-20 md:w-20 lg:h-[88px] lg:w-[88px]" />
						<div className="h-3 w-14 animate-pulse rounded bg-border" />
					</div>
				))}
			</div>
		</div>
	);
}

export default function CurrentOfferSkeleton() {
	return (
		<div className="w-full min-w-0 space-y-2.5 sm:space-y-3 lg:space-y-4">
			<div className="h-6 w-32 animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800 sm:h-7 sm:w-36" />
			<div className="flex gap-2.5 overflow-hidden sm:gap-3 md:gap-4">
				{Array.from({ length: 3 }).map((_, i) => (
					<div
						key={i}
						className="h-[min(58vw,268px)] w-[min(44vw,200px)] min-w-[148px] shrink-0 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800 sm:h-[268px] sm:w-[172px] sm:rounded-2xl md:w-[180px] lg:w-[190px] xl:w-[200px]"
					/>
				))}
			</div>
		</div>
	);
}

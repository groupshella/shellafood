export default function DiscountedStoreSkeleton() {
	return (
		<div className="w-full min-w-0 space-y-2.5 sm:space-y-3 lg:space-y-4">
			<div className="h-6 w-36 animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800 sm:h-7 sm:w-40" />
			<div className="flex gap-2.5 overflow-hidden sm:gap-3 md:gap-4">
				{Array.from({ length: 3 }).map((_, i) => (
					<div
						key={i}
						className="h-[min(48vw,220px)] w-[min(72vw,300px)] min-w-[220px] shrink-0 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800 sm:h-[220px] sm:w-[260px] sm:rounded-2xl md:w-[280px] lg:w-[300px] xl:w-[320px]"
					/>
				))}
			</div>
		</div>
	);
}

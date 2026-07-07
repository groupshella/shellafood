export default function RecentOrderSkeleton() {
	return (
		<div className="w-full min-w-0 space-y-2.5 sm:space-y-3 lg:space-y-4">
			<div className="h-6 w-28 animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800 sm:h-7 sm:w-32" />
			<div className="flex flex-col gap-2 sm:gap-2.5 lg:gap-3">
				{Array.from({ length: 3 }).map((_, i) => (
					<div
						key={i}
						className="flex items-center gap-2.5 rounded-xl bg-white px-3 py-2.5 shadow-sm ring-1 ring-black/[0.05] sm:gap-3 sm:rounded-2xl sm:px-4 sm:py-3 lg:px-6 lg:py-4"
					>
						<div className="h-11 w-11 shrink-0 animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800 sm:h-[52px] sm:w-[52px] sm:rounded-xl" />
						<div className="flex-1 space-y-1.5 sm:space-y-2">
							<div className="h-3.5 w-2/3 animate-pulse rounded bg-gray-100 dark:bg-gray-800" />
							<div className="flex items-center gap-1.5">
								<div className="h-5 w-16 animate-pulse rounded-full bg-gray-100 dark:bg-gray-800" />
								<div className="h-3 w-20 animate-pulse rounded bg-gray-100 dark:bg-gray-800" />
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

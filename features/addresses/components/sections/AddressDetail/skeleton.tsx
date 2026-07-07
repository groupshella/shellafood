export default function AddressDetailSkeleton() {
	return (
		<div className="flex animate-pulse flex-col gap-3 px-3 pb-8 pt-4 sm:gap-4 sm:px-5 sm:pt-5 lg:grid lg:grid-cols-2 lg:gap-5 lg:px-6 lg:pb-10">
			{[1, 2, 3].map((i) => (
				<div
					key={i}
					className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white px-3 py-3 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:px-4 md:px-5"
				>
					{[1, 2].map((j) => (
						<div key={j} className="flex items-center gap-2.5 py-1 sm:gap-3">
							<div className="h-9 w-9 shrink-0 rounded-xl bg-gray-200 dark:bg-gray-700 sm:h-10 sm:w-10" />
							<div className="flex flex-1 flex-col gap-1.5">
								<div className="h-2.5 w-16 rounded bg-gray-100 dark:bg-gray-700/60" />
								<div className="h-4 w-32 max-w-full rounded bg-gray-200 dark:bg-gray-700" />
							</div>
						</div>
					))}
				</div>
			))}
		</div>
	);
}

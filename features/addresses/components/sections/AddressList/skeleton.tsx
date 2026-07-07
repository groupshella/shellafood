export default function AddressListSkeleton() {
	return (
		<div className="flex animate-pulse flex-col gap-3 px-3 pb-6 pt-4 sm:gap-4 sm:px-5 sm:pt-5 lg:px-6 lg:pb-8">
			<div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-2 lg:gap-5">
				{[1, 2, 3].map((i) => (
					<div
						key={i}
						className="flex items-start gap-2.5 rounded-2xl border border-gray-100 bg-white px-3 py-3.5 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:gap-3 sm:px-4 sm:py-4 md:px-5"
					>
						<div className="h-10 w-10 shrink-0 rounded-full bg-gray-200 dark:bg-gray-700 sm:h-11 sm:w-11" />
						<div className="flex flex-1 flex-col gap-2">
							<div className="h-4 w-24 rounded-md bg-gray-200 dark:bg-gray-700" />
							<div className="h-3 w-48 max-w-full rounded-md bg-gray-100 dark:bg-gray-700/60" />
						</div>
					</div>
				))}
			</div>
			<div className="mt-2 h-14 w-full rounded-2xl bg-gray-200 dark:bg-gray-700 lg:max-w-md lg:ms-auto" />
		</div>
	);
}

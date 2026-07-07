export default function EditAddressSkeleton() {
	return (
		<div className="flex animate-pulse flex-col gap-3 px-3 pb-8 pt-4 sm:gap-4 sm:px-5 sm:pt-5 lg:gap-5 lg:px-6 lg:pb-10">
			{[1, 2].map((i) => (
				<div
					key={i}
					className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white px-3 py-3.5 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:gap-4 sm:px-4 sm:py-4 md:px-5"
				>
					{[1, 2, 3].map((j) => (
						<div key={j} className="flex flex-col gap-1.5">
							<div className="h-3 w-20 rounded bg-gray-200 dark:bg-gray-700" />
							<div className="h-11 rounded-xl bg-gray-100 dark:bg-gray-700/60" />
						</div>
					))}
				</div>
			))}
			<div className="rounded-2xl border border-gray-100 bg-white px-3 py-3.5 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:px-4 sm:py-4 md:px-5">
				<div className="mb-2 h-3 w-24 rounded bg-gray-200 dark:bg-gray-700" />
				<div className="h-20 rounded-xl bg-gray-100 dark:bg-gray-700/60" />
			</div>
			<div className="mt-2 h-14 rounded-2xl bg-gray-200 dark:bg-gray-700 lg:max-w-md lg:ms-auto" />
		</div>
	);
}

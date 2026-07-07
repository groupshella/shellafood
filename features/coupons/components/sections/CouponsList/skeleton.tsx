const CONTENT_PADDING = "px-3 pb-8 pt-4 sm:px-4 sm:pb-10 sm:pt-5 md:px-5 lg:px-6";
const COUPONS_GRID = "grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4 lg:gap-5";

export default function CouponsListSkeleton() {
	return (
		<div className={`flex animate-pulse flex-col gap-4 sm:gap-5 ${CONTENT_PADDING}`}>
			<div className="h-11 rounded-2xl bg-gray-100 dark:bg-gray-800 sm:h-12 lg:max-w-xl" />
			<div className={COUPONS_GRID}>
				{[0, 1, 2].map((i) => (
					<div key={i} className="flex h-full min-w-0 flex-row-reverse overflow-hidden rounded-2xl shadow-sm">
						<div className="w-10 shrink-0 rounded-l-2xl bg-gray-200 dark:bg-gray-700 sm:w-11 md:w-12" style={{ minHeight: "100px" }} />
						<div className="flex min-w-0 flex-1 flex-col justify-center gap-2 rounded-r-2xl border border-gray-100 border-s-0 bg-white px-3 py-3 dark:border-gray-700 dark:bg-gray-800 sm:px-4">
							<div className="flex items-center justify-between gap-2 sm:gap-3">
								<div className="h-3.5 w-16 rounded bg-gray-100 dark:bg-gray-700" />
								<div className="h-8 w-24 rounded-lg bg-gray-100 dark:bg-gray-700 sm:h-9 sm:w-28" />
							</div>
							<div className="h-4 w-2/3 self-end rounded bg-gray-200 dark:bg-gray-700" />
							<div className="my-1 border-t border-dashed border-gray-200 dark:border-gray-700" />
							<div className="h-3 w-full rounded bg-gray-100 dark:bg-gray-700" />
							<div className="h-3 w-1/3 self-end rounded bg-gray-100 dark:bg-gray-600" />
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

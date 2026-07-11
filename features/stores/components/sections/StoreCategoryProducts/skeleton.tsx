const PRODUCTS_GRID =
	"grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-2.5 md:grid-cols-3 lg:grid-cols-4 lg:gap-3 xl:grid-cols-5";

function ProductCardSkeleton() {
	return (
		<div className="relative flex min-h-[172px] w-full min-w-0 flex-row items-center gap-2 overflow-hidden rounded-lg bg-white shadow-[0_7px_19.8px_rgba(0,0,0,0.04)] dark:bg-gray-800 sm:min-h-[190px]">
			<div className="flex flex-1 flex-col items-end gap-2 self-stretch p-2">
				<div className="h-14 w-14 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-700 sm:h-[60px] sm:w-[60px]" />
				<div className="flex w-full flex-col gap-3 px-1">
					<div className="h-3.5 w-full animate-pulse rounded bg-gray-100 dark:bg-gray-700" />
					<div className="h-3 w-2/3 animate-pulse rounded bg-gray-100 dark:bg-gray-700" />
					<div className="h-3 w-1/3 animate-pulse rounded bg-gray-200 dark:bg-gray-600" />
				</div>
			</div>
			<div className="flex shrink-0 flex-col items-center justify-between gap-3 self-stretch p-0.5">
				<div className="h-9 w-9 animate-pulse rounded-full bg-gray-100 dark:bg-gray-700" />
				<div className="h-9 w-9 animate-pulse rounded-full bg-gray-100 dark:bg-gray-700" />
			</div>
		</div>
	);
}

export default function StoreCategoryProductsSkeleton() {
	return (
		<div className="animate-pulse px-3 pb-4 pt-2.5 sm:px-4 sm:pb-5 sm:pt-3 md:px-5 lg:mx-auto lg:max-w-4xl lg:px-6 xl:max-w-5xl 2xl:max-w-6xl">
			<div className="mb-2.5 h-5 w-28 rounded bg-gray-200 dark:bg-gray-700 ms-auto sm:mb-3 sm:h-6 sm:w-32" />

			<div className={PRODUCTS_GRID}>
				{Array.from({ length: 6 }).map((_, i) => (
					<ProductCardSkeleton key={i} />
				))}
			</div>
		</div>
	);
}

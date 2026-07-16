const PRODUCTS_LIST_MOBILE = "grid grid-cols-1 gap-2 md:hidden";
const PRODUCTS_GRID_DESKTOP =
	"hidden md:grid md:grid-cols-3 md:gap-3 lg:grid-cols-4 lg:gap-3.5 xl:grid-cols-5 xl:gap-4";

function ListCardSkeleton() {
	return (
		<div className="flex w-full min-w-0 items-center gap-3 rounded-2xl bg-background p-3 shadow-[0_1px_3px_rgba(0,0,0,0.04)] ring-1 ring-border sm:gap-3.5 sm:p-3.5">
			<div className="h-[4.5rem] w-[4.5rem] shrink-0 animate-pulse rounded-2xl bg-card sm:h-20 sm:w-20" />
			<div className="flex min-w-0 flex-1 flex-col gap-2">
				<div className="h-3.5 w-3/4 animate-pulse rounded bg-card" />
				<div className="h-3 w-1/3 animate-pulse rounded bg-border" />
			</div>
			<div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-card sm:h-11 sm:w-11" />
		</div>
	);
}

function GridCardSkeleton() {
	return (
		<div className="flex w-full min-w-0 flex-col overflow-hidden rounded-xl bg-background shadow-[0_2px_10px_rgba(0,0,0,0.05)] ring-1 ring-border">
			<div className="aspect-square w-full animate-pulse bg-card" />
			<div className="flex flex-col gap-2.5 p-2.5 sm:p-3">
				<div className="h-3.5 w-full animate-pulse rounded bg-card" />
				<div className="h-3 w-2/3 animate-pulse rounded bg-border" />
				<div className="mt-1 flex items-center justify-between">
					<div className="h-4 w-16 animate-pulse rounded bg-border" />
					<div className="h-9 w-9 animate-pulse rounded-full bg-card" />
				</div>
			</div>
		</div>
	);
}

export default function StoreCategoryProductsSkeleton() {
	return (
		<div className="animate-pulse px-3 pb-4 pt-2.5 sm:px-4 sm:pb-5 sm:pt-3 md:px-5 lg:mx-auto lg:max-w-4xl lg:px-6 xl:max-w-5xl 2xl:max-w-6xl">
			<div className="mb-2.5 h-5 w-28 rounded bg-card sm:mb-3 sm:h-6 sm:w-32 md:mb-3.5" />

			<div className={PRODUCTS_LIST_MOBILE}>
				{Array.from({ length: 4 }).map((_, i) => (
					<ListCardSkeleton key={`list-${i}`} />
				))}
			</div>
			<div className={PRODUCTS_GRID_DESKTOP}>
				{Array.from({ length: 8 }).map((_, i) => (
					<GridCardSkeleton key={`grid-${i}`} />
				))}
			</div>
		</div>
	);
}

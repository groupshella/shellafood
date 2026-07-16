export default function DiscountCodeSkeleton() {
	return (
		<div>
			<div className="mb-3 h-4 w-32 animate-pulse rounded bg-border sm:h-[18px] sm:w-36" />
			<div className="flex flex-col gap-2 rounded-xl bg-card p-1.5 sm:flex-row sm:items-center sm:p-2">
				<div className="h-11 flex-1 animate-pulse rounded-lg bg-border sm:h-12" />
				<div className="h-11 w-full shrink-0 animate-pulse rounded-lg bg-border/80 sm:h-12 sm:w-20" />
			</div>
		</div>
	);
}

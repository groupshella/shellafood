export default function InvoiceDetailsSkeleton() {
	return (
		<div>
			<div className="mb-3 h-4 w-32 animate-pulse rounded bg-border sm:h-[18px] sm:w-36" />
			<div className="rounded-2xl border border-border bg-card p-3.5 sm:p-4 lg:rounded-3xl">
				<div className="space-y-3 sm:space-y-3.5">
					{Array.from({ length: 4 }).map((_, i) => (
						<div key={i} className="flex items-center justify-between gap-3">
							<div className="h-3 w-20 animate-pulse rounded bg-border" />
							<div className="h-3 w-16 animate-pulse rounded bg-border" />
						</div>
					))}
					<div className="border-t border-border pt-3 sm:pt-3.5">
						<div className="flex items-center justify-between gap-3">
							<div className="h-4 w-24 animate-pulse rounded bg-border/80" />
							<div className="h-4 w-20 animate-pulse rounded bg-border/80" />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default function EditAddressSkeleton() {
	return (
		<div className="mx-auto flex w-full max-w-lg animate-pulse flex-col gap-3 px-3 pb-8 pt-4 sm:max-w-xl sm:gap-4 sm:px-5 sm:pt-5 md:max-w-2xl lg:max-w-3xl lg:gap-5 lg:px-6 lg:pb-10">
			{[1, 2].map((i) => (
				<div
					key={i}
					className="flex flex-col gap-3 rounded-2xl border border-border bg-background px-3 py-3.5 shadow-sm sm:gap-4 sm:px-4 sm:py-4 md:px-5"
				>
					{[1, 2, 3].map((j) => (
						<div key={j} className="flex flex-col gap-1.5">
							<div className="h-3 w-20 rounded bg-card" />
							<div className="h-11 rounded-xl bg-border" />
						</div>
					))}
				</div>
			))}
			<div className="rounded-2xl border border-border bg-background px-3 py-3.5 shadow-sm sm:px-4 sm:py-4 md:px-5">
				<div className="mb-2 h-3 w-24 rounded bg-card" />
				<div className="h-20 rounded-xl bg-border" />
			</div>
			<div className="mt-2 h-14 rounded-2xl bg-card lg:ms-auto lg:max-w-md" />
		</div>
	);
}

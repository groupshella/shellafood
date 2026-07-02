export default function CouponsListSkeleton() {
	return (
		<div dir="rtl" className="flex animate-pulse flex-col gap-4 px-4 pb-8 sm:px-6">
			<div className="h-11 rounded-full bg-gray-100" />
			<div className="flex flex-col gap-3">
				{[0, 1, 2].map((i) => (
					<div key={i} className="flex h-24 overflow-hidden rounded-2xl border border-gray-100">
						<div className="w-16 shrink-0 bg-gray-100" />
						<div className="flex flex-1 flex-col justify-center gap-2 px-4">
							<div className="h-3 w-1/3 rounded bg-gray-100" />
							<div className="h-4 w-2/3 rounded bg-gray-100" />
							<div className="h-3 w-1/2 rounded bg-gray-100" />
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

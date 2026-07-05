export default function ModuleSkeleton() {
	return (
		<div className="flex w-full flex-col items-end gap-2">
			<div className="h-6 w-16 animate-pulse rounded bg-[#F6F5F8]" />
			<div className="grid h-[190px] w-full grid-cols-2 gap-4">
				<div className="flex flex-col gap-2">
					<div className="h-[91px] animate-pulse rounded-lg bg-[#F6F5F8]" />
					<div className="h-[91px] animate-pulse rounded-lg bg-[#F6F5F8]" />
				</div>
				<div className="flex flex-col gap-2">
					<div className="h-[58px] animate-pulse rounded-lg bg-[#F6F5F8]" />
					<div className="h-[58px] animate-pulse rounded-lg bg-[#F6F5F8]" />
					<div className="h-[58px] animate-pulse rounded-lg bg-[#F6F5F8]" />
				</div>
			</div>
		</div>
	);
}

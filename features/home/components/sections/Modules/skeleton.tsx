export default function ModuleSkeleton() {
	return (
		<div className="flex w-full min-w-0 flex-col items-start gap-2 sm:gap-3 lg:gap-4">
			<div className="h-5 w-16 animate-pulse rounded bg-border sm:h-6 sm:w-20 md:h-7 md:w-24" />
			<div className="grid w-full grid-cols-2 gap-2 sm:gap-3 md:gap-4 lg:gap-5">
				<div className="flex flex-col gap-2 sm:gap-3 lg:gap-4">
					<div className="min-h-[76px] animate-pulse rounded-lg bg-border sm:min-h-[91px] md:min-h-[100px] lg:min-h-[110px]" />
					<div className="min-h-[76px] animate-pulse rounded-lg bg-border sm:min-h-[91px] md:min-h-[100px] lg:min-h-[110px]" />
				</div>
				<div className="flex flex-col gap-2 sm:gap-3 lg:gap-4">
					<div className="min-h-[48px] animate-pulse rounded-lg bg-border sm:min-h-[58px] md:min-h-[64px] lg:min-h-[70px]" />
					<div className="min-h-[48px] animate-pulse rounded-lg bg-border sm:min-h-[58px] md:min-h-[64px] lg:min-h-[70px]" />
					<div className="min-h-[48px] animate-pulse rounded-lg bg-border sm:min-h-[58px] md:min-h-[64px] lg:min-h-[70px]" />
				</div>
			</div>
		</div>
	);
}

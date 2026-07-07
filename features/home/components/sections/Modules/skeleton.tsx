export default function ModuleSkeleton() {
	return (
		<div className="flex w-full min-w-0 flex-col items-end gap-2 sm:gap-3 lg:gap-4">
			<div className="h-5 w-16 animate-pulse rounded bg-[#F6F5F8] dark:bg-gray-700 sm:h-6 sm:w-20" />
			<div className="grid w-full grid-cols-2 gap-2 sm:gap-3 md:gap-4 lg:gap-5">
				<div className="flex flex-col gap-2 sm:gap-3 lg:gap-4">
					<div className="min-h-[76px] animate-pulse rounded-lg bg-[#F6F5F8] dark:bg-gray-700 sm:min-h-[91px] md:min-h-[100px] lg:min-h-[110px]" />
					<div className="min-h-[76px] animate-pulse rounded-lg bg-[#F6F5F8] dark:bg-gray-700 sm:min-h-[91px] md:min-h-[100px] lg:min-h-[110px]" />
				</div>
				<div className="flex flex-col gap-2 sm:gap-3 lg:gap-4">
					<div className="min-h-[48px] animate-pulse rounded-lg bg-[#F6F5F8] dark:bg-gray-700 sm:min-h-[58px] md:min-h-[64px] lg:min-h-[70px]" />
					<div className="min-h-[48px] animate-pulse rounded-lg bg-[#F6F5F8] dark:bg-gray-700 sm:min-h-[58px] md:min-h-[64px] lg:min-h-[70px]" />
					<div className="min-h-[48px] animate-pulse rounded-lg bg-[#F6F5F8] dark:bg-gray-700 sm:min-h-[58px] md:min-h-[64px] lg:min-h-[70px]" />
				</div>
			</div>
		</div>
	);
}

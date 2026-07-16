export default function StatisticsSkeleton({
	isArabic = true,
}: {
	isArabic?: boolean;
}) {
	return (
		<div
			className="mx-auto flex w-full max-w-lg flex-col gap-6 px-4 pt-4 sm:max-w-2xl sm:gap-7 md:gap-8 lg:max-w-4xl xl:max-w-5xl"
			dir={isArabic ? "rtl" : "ltr"}
			lang={isArabic ? "ar" : "en"}
		>
			<div className="mx-auto h-11 w-full max-w-md animate-pulse rounded-xl bg-card sm:h-12 md:max-w-sm" />
			<div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
				<div className="h-[93px] animate-pulse rounded-lg bg-card sm:h-24 md:h-28" />
				<div className="h-[93px] animate-pulse rounded-lg bg-card sm:h-24 md:h-28" />
			</div>
			<div className="h-[220px] w-full animate-pulse rounded-2xl bg-card sm:h-60" />
			<div className="flex flex-col gap-3 sm:gap-3.5 md:grid md:grid-cols-2 md:gap-4">
				<div className="h-[72px] animate-pulse rounded-[14px] bg-card sm:h-20" />
				<div className="h-[72px] animate-pulse rounded-[14px] bg-card sm:h-20" />
			</div>
		</div>
	);
}

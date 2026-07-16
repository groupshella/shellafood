export default function InviteFriendsSkeleton({
	isArabic = true,
}: {
	isArabic?: boolean;
}) {
	return (
		<div
			className="flex min-h-dvh animate-pulse flex-col bg-background"
			dir={isArabic ? "rtl" : "ltr"}
			lang={isArabic ? "ar" : "en"}
		>
			<header className="grid grid-cols-[auto_1fr_auto] items-center px-4 py-5 sm:px-5 md:px-6">
				<div className="h-9 w-9 rounded-full bg-card" />
				<div className="mx-auto h-5 w-28 rounded bg-border" />
				<div className="w-9" />
			</header>

			<main className="mx-auto flex w-full max-w-lg flex-col gap-6 px-4 pt-6 sm:max-w-2xl sm:gap-7 sm:px-5 md:max-w-3xl lg:max-w-4xl lg:px-6">
				<div className="mx-auto flex h-12 w-full rounded-2xl bg-card p-1 sm:max-w-md md:max-w-lg">
					<div className="h-full flex-1 rounded-xl bg-border" />
					<div className="h-full flex-1 rounded-xl bg-card" />
				</div>

				<div className="mx-auto aspect-[241/210] w-full max-w-[241px] rounded-2xl bg-card sm:max-w-[280px] md:max-w-[320px] lg:max-w-[360px]" />
				<div className="mx-auto h-6 w-48 rounded bg-border sm:w-56" />
				<div className="h-4 w-full rounded bg-card" />
				<div className="h-4 w-11/12 rounded bg-card" />
				<div className="h-24 w-full rounded-2xl bg-card sm:h-28" />
			</main>
		</div>
	);
}

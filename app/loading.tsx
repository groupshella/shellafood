import { isArabicLocale } from "@/shared/lib/locale";

export default async function Loading() {
	const isArabic = await isArabicLocale();

	return (
		<div
			dir={isArabic ? "rtl" : "ltr"}
			lang={isArabic ? "ar" : "en"}
			role="status"
			aria-live="polite"
			aria-busy="true"
			className="relative flex min-h-dvh w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-background via-background to-card"
		>
			<div
				aria-hidden
				className="absolute inset-x-0 top-0 h-0.5 bg-brand/10"
			>
				<div className="h-full w-full origin-left animate-pulse bg-gradient-to-r from-brand/20 via-brand to-brand/20 motion-reduce:animate-none" />
			</div>

			<div className="flex flex-col items-center gap-6 px-6 sm:gap-7 md:gap-8">
				<div className="relative flex h-14 w-14 items-center justify-center sm:h-16 sm:w-16 md:h-20 md:w-20">
					<div
						aria-hidden
						className="absolute inset-0 rounded-full border-[3px] border-brand/15"
					/>
					<div
						aria-hidden
						className="absolute inset-0 motion-safe:animate-spin rounded-full border-[3px] border-transparent border-t-brand border-r-brand/50 motion-reduce:animate-none"
					/>
				</div>

				<div className="flex flex-col items-center gap-3">
					<p className="text-sm font-semibold tracking-tight text-foreground sm:text-base md:text-lg">
						{isArabic ? "جاري التحميل..." : "Loading..."}
					</p>
				</div>
			</div>

			<span className="sr-only">
				{isArabic
					? "جاري التحميل، يرجى الانتظار"
					: "Loading, please wait"}
			</span>
		</div>
	);
}

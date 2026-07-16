import Link from "next/link";

export type OfferDiscountPercent = 50 | 35 | 25;

interface OfferDiscountCardProps {
	percent: OfferDiscountPercent;
	href: string;
	isArabic: boolean;
}

function TagIcon() {
	return (
		<svg className="h-2.5 w-2.5 shrink-0 sm:h-3 sm:w-3" viewBox="0 0 12 12" fill="none" aria-hidden>
			<path
				d="M2.1 6.8 5.2 9.9c.3.3.8.3 1.1 0l3.6-3.6c.2-.2.3-.4.3-.7V2.8c0-.5-.4-.9-.9-.9H6.4c-.3 0-.5.1-.7.3L2.1 5.7c-.3.3-.3.8 0 1.1Z"
				stroke="currentColor"
				strokeWidth="1.1"
				strokeLinejoin="round"
			/>
			<circle cx="7.6" cy="4.2" r="0.85" fill="currentColor" />
		</svg>
	);
}

function CtaArrowIcon({ isArabic }: { isArabic: boolean }) {
	return (
		<svg
			viewBox="0 0 10 10"
			fill="none"
			className={`h-2.5 w-2.5 shrink-0 sm:h-3 sm:w-3 ${isArabic ? "-scale-x-100" : ""}`}
			aria-hidden
		>
			<path
				d="M3 2.5 7 5 3 7.5"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}

export function OfferDiscountCard({ percent, href, isArabic }: OfferDiscountCardProps) {
	return (
		<Link
			href={href}
			dir={isArabic ? "rtl" : "ltr"}
			lang={isArabic ? "ar" : "en"}
			className={[
				"group relative block shrink-0 overflow-hidden",
				"w-[min(82vw,17.5rem)] sm:w-[19.5rem] md:w-[22rem] lg:w-[24rem]",
				"aspect-[271/148] sm:aspect-[312/160] md:aspect-[352/168]",
				"rounded-2xl sm:rounded-[1.25rem] md:rounded-3xl",
				"bg-background shadow-[0_2px_10px_rgba(120,97,166,0.08)]",
				"ring-1 ring-[#E8E0F5]/70",
				"transition-transform duration-200 active:scale-[0.98]",
				"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background",
			].join(" ")}
			aria-label={
				isArabic
					? `خصومات حصرية حتى ${percent}%`
					: `Exclusive discounts up to ${percent}%`
			}
		>
			{/* Decorative blobs — match Figma placement */}
			<div
				aria-hidden
				className="pointer-events-none absolute -left-4 -top-4 size-14 rounded-full bg-[#DFD3F5]/55 sm:-left-5 sm:-top-5 sm:size-16 md:size-[4.5rem] dark:bg-[#7C5EC8]/25"
			/>
			<div
				aria-hidden
				className="pointer-events-none absolute bottom-1 left-10 size-9 rounded-full bg-[#3EC856]/[0.08] sm:left-12 sm:size-11 md:size-12 dark:bg-[#3EC856]/15"
			/>

			{/* Discount circle — full card height */}
			<div
				aria-hidden
				className={[
					"pointer-events-none absolute -right-[6%] top-0",
					"flex h-full aspect-square items-center justify-center rounded-full",
					"bg-[linear-gradient(145deg,#3EC856_6%,#30913F_59%,#22702E_94%)]",
					"shadow-[0_5px_20px_rgba(48,145,63,0.38),inset_0_1px_0_rgba(255,255,255,0.18)]",
				].join(" ")}
			>
				<div className="absolute inset-[7%] rounded-full border border-white/20" />

				<span className="absolute -top-0.5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1 whitespace-nowrap rounded-full border border-[#DFD3F5]/45 bg-[#7861A6]/90 px-2 py-0.5 text-[0.5rem] font-bold tracking-wide text-white shadow-sm sm:top-0 sm:px-2.5 sm:py-1 sm:text-[0.5625rem] md:text-[0.625rem]">
					<TagIcon />
					{isArabic ? "خصم حصري" : "Exclusive"}
				</span>

				<div className="relative z-10 flex flex-col items-center text-center text-white">
					<span className="text-[0.625rem] font-semibold tracking-wide text-white/90 sm:text-[0.6875rem] md:text-xs">
						{isArabic ? "خصم حتى" : "Up to"}
					</span>
					<span className="text-[2rem] font-black leading-none tracking-tight sm:text-[2.35rem] md:text-[2.75rem]">
						{percent}%
					</span>
					<span className="text-[0.5625rem] font-medium text-white/85 sm:text-[0.625rem] md:text-[0.6875rem]">
						{isArabic ? "لفترة محدودة" : "Limited time"}
					</span>
				</div>
			</div>
			{/* Copy + CTA */}
			<div className="absolute bottom-0 -left-2 z-10 flex h-full w-[58%] flex-col justify-between px-3.5 py-3.5 sm:w-[56%] sm:px-4 sm:py-4 md:w-[55%] md:px-5 md:py-5">
				<div className="flex flex-col gap-1 text-start sm:gap-1.5">
					<h3 className="text-[0.8125rem] font-bold leading-snug text-foreground sm:text-[0.9375rem] md:text-base">
						{isArabic
							? `خصومات حصرية حتى ${percent}%`
							: `Exclusive discounts up to ${percent}%`}
					</h3>
					<p className="text-[0.6875rem] font-medium leading-snug text-muted sm:text-xs md:text-[0.8125rem]">
						{isArabic
							? "على آلاف المنتجات المختارة"
							: "On thousands of selected products"}
					</p>
				</div>

				<span className="inline-flex w-fit items-center gap-1.5 rounded-md bg-brand px-3 py-1.5 text-[0.625rem] font-bold text-brand-foreground transition-colors group-hover:brightness-95 sm:rounded-lg sm:px-3.5 sm:py-2 sm:text-[0.6875rem] md:text-xs">
					{isArabic ? "استكشف العروض" : "Explore offers"}
					<CtaArrowIcon isArabic={isArabic} />
				</span>
			</div>
		</Link>
	);
}

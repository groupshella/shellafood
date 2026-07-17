"use client";

import Image from "@/shared/components/SecureImage";

const TAJAWAL = { fontFamily: "'Tajawal', sans-serif" } as const;
const AFACAD = { fontFamily: "'Afacad Flux', sans-serif" } as const;

export function PointsSummaryCard({
	points,
	isArabic,
}: {
	points: number;
	isArabic: boolean;
}) {
	const display = Number.isInteger(points) ? String(points) : points.toFixed(2);

	return (
		<section
			className="relative w-full overflow-hidden rounded-[16px] bg-[#EFE6FF] px-4 py-6 dark:bg-[#2D1F47] sm:rounded-[18px] sm:px-5 sm:py-7"
			aria-label={
				isArabic ? "نقاطك القابلة للتحويل" : "Your convertible points"
			}
		>
			<div className="pointer-events-none absolute inset-0" aria-hidden>
				<Image
					src="/profile/stat-coins.png"
					alt=""
					width={48}
					height={48}
					className="absolute start-3 top-3 h-9 w-9 rotate-[-18deg] object-contain opacity-90 sm:h-11 sm:w-11"
				/>
				<Image
					src="/profile/stat-coins.png"
					alt=""
					width={36}
					height={36}
					className="absolute end-4 top-5 h-7 w-7 rotate-[22deg] object-contain opacity-80 sm:h-8 sm:w-8"
				/>
				<Image
					src="/profile/stat-coins.png"
					alt=""
					width={40}
					height={40}
					className="absolute bottom-4 start-8 h-8 w-8 rotate-[12deg] object-contain opacity-75 sm:h-9 sm:w-9"
				/>
				<Image
					src="/profile/stat-coins.png"
					alt=""
					width={28}
					height={28}
					className="absolute bottom-6 end-10 h-6 w-6 rotate-[-8deg] object-contain opacity-70"
				/>
			</div>

			<div className="relative z-10 flex flex-col items-center gap-1 text-center">
				<h2
					className="text-[16px] font-bold leading-[160%] text-foreground sm:text-[17px]"
					style={TAJAWAL}
				>
					{isArabic ? "نقاطك القابلة للتحويل" : "Your convertible points"}
				</h2>
				<p
					className="text-[13px] font-medium leading-[160%] text-[#7861A6] dark:text-[#C4B5E0] sm:text-[14px]"
					style={TAJAWAL}
				>
					{isArabic ? "اربح نقاط الآن" : "Earn points now"}
				</p>
				<p
					className="mt-2 text-[clamp(36px,10vw,48px)] font-extrabold leading-none tabular-nums text-foreground"
					style={AFACAD}
				>
					{display}
				</p>
			</div>
		</section>
	);
}

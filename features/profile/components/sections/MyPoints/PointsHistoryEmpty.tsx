import Image from "next/image";

const TAJAWAL = { fontFamily: "'Tajawal', sans-serif" } as const;

export function PointsHistoryEmpty({ isArabic }: { isArabic: boolean }) {
	return (
		<div className="flex w-full flex-col items-center justify-center gap-5 py-10 sm:py-14">
			<div
				className="relative aspect-square w-full max-w-[180px] sm:max-w-[200px] md:max-w-[220px]"
				aria-hidden
			>
				<Image
					src="/profile/points-empty.png"
					alt=""
					fill
					className="object-contain"
					sizes="(max-width: 640px) 180px, (max-width: 768px) 200px, 220px"
					priority
				/>
			</div>
			<p
				className="max-w-[280px] text-center text-[16px] font-bold leading-[160%] text-foreground sm:max-w-sm sm:text-[17px]"
				style={TAJAWAL}
			>
				{isArabic
					? "للأسف لم تربح نقاط حتى الاَن"
					: "You haven't earned any points yet"}
			</p>
		</div>
	);
}

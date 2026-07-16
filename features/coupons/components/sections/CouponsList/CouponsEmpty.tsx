import Image from "next/image";

type CouponsEmptyProps = {
	message?: string;
	/** Full viewport empty/error page vs. tab-level empty */
	fullPage?: boolean;
	isArabic: boolean;
};

export function CouponsEmpty({
	message,
	fullPage = true,
	isArabic,
}: CouponsEmptyProps) {
	const displayMessage =
		message ??
		(isArabic ? "لا يوجد كوبونات في الوقت الحالي" : "No coupons available right now");

	return (
		<div
			dir={isArabic ? "rtl" : "ltr"}
			lang={isArabic ? "ar" : "en"}
			className={[
				"flex flex-col items-center justify-center px-4 text-center sm:px-6 md:px-8",
				fullPage
					? "min-h-[calc(100dvh-8.5rem)] sm:min-h-[calc(100dvh-9.5rem)]"
					: "min-h-[16rem] py-10 sm:min-h-[18rem] sm:py-14",
			].join(" ")}
		>
			<div
				className={[
					"relative mb-6 aspect-square w-full sm:mb-8",
					fullPage
						? "max-w-[12rem] sm:max-w-[14rem] md:max-w-[16rem] lg:max-w-[18rem]"
						: "max-w-[10rem] sm:max-w-[12rem] md:max-w-[14rem]",
				].join(" ")}
			>
				<Image
					src="/coupons/coupons-empty.png"
					alt={isArabic ? "لا يوجد كوبونات" : "No coupons"}
					fill
					className="object-contain"
					sizes="(max-width: 640px) 192px, (max-width: 768px) 224px, 288px"
					priority={fullPage}
				/>
			</div>

			<h2 className="max-w-[240px] text-lg font-bold leading-snug text-foreground sm:max-w-xs sm:text-xl md:max-w-sm">
				{displayMessage}
			</h2>
		</div>
	);
}

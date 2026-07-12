import Image from "next/image";
import Link from "next/link";
import { memo } from "react";
import { PromoBannerItem } from "./promo-banners.config";

interface PromoBannerCardProps {
	banner: PromoBannerItem;
	priority?: boolean;
	isArabic: boolean;
}

export const PromoBannerCard = memo(function PromoBannerCard({
	banner,
	priority = false,
	isArabic,
}: PromoBannerCardProps) {
	const card = (
		<div
			className={[
				"relative w-full overflow-hidden rounded-xl bg-gradient-to-br from-[#F7F9F7] to-[#EEF2EE]",
				"shadow-sm ring-1 ring-black/[0.04]",
				"transition-transform duration-200 active:scale-[0.98]",
				"dark:from-gray-800 dark:to-gray-700 dark:ring-white/[0.06]",
				"sm:rounded-2xl",
				banner.aspectClass,
				"sm:aspect-[343/90] md:aspect-[343/84] lg:aspect-[343/80] xl:aspect-[343/76]",
			].join(" ")}
		>
			<Image
				src={banner.src}
				alt={banner.alt || isArabic ? "موقع شلة" : "Website banner"}
				fill
				priority={priority}
				quality={90}
				className="object-cover object-center"
				sizes="(max-width: 640px) calc(100vw - 24px), (max-width: 1024px) calc(100vw - 48px), (max-width: 1536px) 896px, 1152px"
				loading={priority ? undefined : "lazy"}
			/>
		</div>
	);

	const linkClassName =
		"block rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2 sm:rounded-2xl dark:focus-visible:ring-offset-gray-900";

	if (banner.external) {
		return (
			<Link
				href={banner.href}
				target="_blank"
				rel="noopener noreferrer"
				className={linkClassName}
				aria-label={banner.alt || isArabic ? "موقع شلة" : "Website banner"}
			>
				{card}
			</Link>
		);
	}

	return (
		<Link href={banner.href} className={linkClassName} aria-label={banner.alt || isArabic ? "موقع شلة" : "Website banner"}>
			{card}
		</Link>
	);
});

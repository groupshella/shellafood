import Image from "next/image";
import Link from "next/link";
import { memo } from "react";
import { PromoBannerItem } from "./promo-banners.config";

interface PromoBannerCardProps {
	banner: PromoBannerItem;
	isArabic: boolean;
	priority?: boolean;
}

export const PromoBannerCard = memo(function PromoBannerCard({
	banner,
	isArabic,
	priority = false,
}: PromoBannerCardProps) {
	const alt = isArabic ? banner.alt.ar : banner.alt.en;

	const card = (
		<div
			className={[
				"relative w-full overflow-hidden rounded-xl bg-gradient-to-br from-card to-border",
				"shadow-sm ring-1 ring-foreground/[0.04]",
				"transition-transform duration-200 active:scale-[0.98]",
				"sm:rounded-2xl",
				banner.aspectClass,
				"sm:aspect-[343/90] md:aspect-[343/84] lg:aspect-[343/80] xl:aspect-[343/76]",
			].join(" ")}
		>
			<Image
				src={banner.src}
				alt={alt}
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
		"block w-full max-w-full rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:rounded-2xl";

	if (banner.external) {
		return (
			<Link
				href={banner.href}
				target="_blank"
				rel="noopener noreferrer"
				className={linkClassName}
				aria-label={alt}
			>
				{card}
			</Link>
		);
	}

	return (
		<Link href={banner.href} className={linkClassName} aria-label={alt}>
			{card}
		</Link>
	);
});

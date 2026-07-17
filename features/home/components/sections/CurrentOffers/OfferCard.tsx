import Image from "@/shared/components/SecureImage";
import Link from "next/link";
import { CurrentOffer } from "@/features/home/types/current-offers.types";
import { PriceTag } from "@/features/home/components/shared/PriceTag";

function OfferWavePattern({ patternId }: { patternId: string }) {
	return (
		<svg className="pointer-events-none absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
			<defs>
				<pattern id={patternId} x="0" y="0" width="140" height="70" patternUnits="userSpaceOnUse">
					<path d="M-20 28 C 10 8, 50 8, 80 28 S 150 48, 180 28" fill="none" stroke="white" strokeWidth="2.5" opacity="0.55" />
					<path d="M-20 48 C 10 28, 50 28, 80 48 S 150 68, 180 48" fill="none" stroke="white" strokeWidth="2" opacity="0.35" />
				</pattern>
			</defs>
			<rect width="100%" height="100%" fill={`url(#${patternId})`} />
		</svg>
	);
}

export function OfferCard({
	offer,
	index,
	isArabic,
}: {
	offer: CurrentOffer;
	index: number;
	isArabic: boolean;
}) {
	const patternId = `wave-${offer.store_id}-${index}`;
	const hasOriginalPrice = offer.original_price > offer.discounted_price;

	return (
		<Link
			href={`/stores/${offer.store_id}`}
			dir={isArabic ? "rtl" : "ltr"}
			lang={isArabic ? "ar" : "en"}
			className={[
				"group flex w-[min(44vw,200px)] min-w-[148px] shrink-0 flex-col overflow-hidden rounded-xl bg-background",
				"shadow-[0_2px_12px_rgba(0,0,0,0.06)] outline-none",
				"transition-transform duration-150 active:scale-[0.98]",
				"focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background",
				"sm:w-[172px] sm:min-w-[172px] md:w-[200px] md:min-w-[200px] lg:w-[220px] lg:min-w-[220px] xl:w-[240px]",
				"sm:rounded-2xl",
			].join(" ")}
			aria-label={`${offer.store_name} — ${offer.offer_title}`}
		>
			<div className="relative aspect-[172/148] w-full shrink-0 overflow-hidden bg-[#FFF5F0] sm:aspect-auto sm:h-[148px] md:h-[160px] lg:h-[172px]">
				<OfferWavePattern patternId={patternId} />
				<div className="relative flex h-full items-center justify-center px-2.5 py-3 sm:px-3 sm:py-4">
					<Image
						src={offer.image_full_url}
						alt={offer.offer_title}
						width={140}
						height={120}
						className="max-h-[75%] w-auto object-contain transition-transform duration-300 group-hover:scale-[1.04] sm:max-h-[120px] md:max-h-[132px]"
						sizes="(max-width: 640px) 44vw, (max-width: 1024px) 200px, 240px"
						priority={index < 3}
						loading={index < 3 ? "eager" : "lazy"}
						placeholder="blur"
						blurDataURL="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNDAiIGhlaWdodD0iMTIwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRkZGNUYwIi8+PC9zdmc+"
					/>
				</div>
			</div>

			<div className="flex flex-1 flex-col gap-1.5 bg-background px-2.5 pb-2.5 pt-2 sm:gap-2 sm:px-3 sm:pb-3 sm:pt-2.5 md:px-3.5 md:pb-3.5">
				<div className="flex items-center justify-start gap-2 sm:gap-2.5">
					<div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-lg bg-card sm:h-11 sm:w-11 md:h-12 md:w-12">
						<Image src={offer.store_logo_full_url} alt={offer.store_name} fill className="object-cover" sizes="48px" loading="lazy" />
					</div>
					<h3 className="line-clamp-1 min-w-0 flex-1 text-sm font-bold leading-snug text-foreground sm:text-[15px] md:text-base">
						{offer.store_name}
					</h3>
				</div>
				<p className="line-clamp-1 text-xs leading-snug text-muted sm:text-[13px] md:text-sm">{offer.offer_title}</p>
				<div className="mt-auto flex flex-wrap items-baseline justify-start gap-1.5 pt-0.5 sm:gap-2">
					<PriceTag amount={offer.discounted_price} />
					{hasOriginalPrice && (
						<PriceTag amount={offer.original_price} size="sm" className="line-through decoration-red-400 decoration-1" />
					)}
				</div>
			</div>
		</Link>
	);
}

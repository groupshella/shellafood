import { ScrollContainer } from "@/features/home/components/shared/ScrollContainer";
import { OfferDiscountCard } from "./OfferDiscountCard";
import { PromoBannerCard } from "./PromoBannerCard";
import { OFFER_DISCOUNTS, WEBSITE_BANNER } from "./promo-banners.config";

export function PromoBanners() {
	return (
		<>
			<section aria-label="عروض وخصومات" className="w-full space-y-4 pt-3">
				<h2 className="text-right text-[16px] font-bold leading-[1.4] text-[#111B18]">
					عروض وخصومات
				</h2>
				<ScrollContainer className="-mx-4 px-4 pb-2 pt-3 [&>div]:gap-4">
					{OFFER_DISCOUNTS.map((offer) => (
						<OfferDiscountCard key={offer.id} percent={offer.percent} href={offer.href} />
					))}
				</ScrollContainer>
			</section>

			<section aria-label="موقع شلة" className="pt-2">
				<PromoBannerCard banner={WEBSITE_BANNER} priority />
			</section>
		</>
	);
}

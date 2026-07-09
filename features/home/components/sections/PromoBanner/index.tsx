import { ScrollContainer } from "@/features/home/components/shared/ScrollContainer";
import { OfferDiscountCard } from "./OfferDiscountCard";
import { PromoBannerCard } from "./PromoBannerCard";
import { OFFER_DISCOUNTS, WEBSITE_BANNER } from "./promo-banners.config";

export function PromoBanners() {
	return (
		<>


			<section aria-label="موقع شلة" className="min-w-0 pt-2 sm:pt-3 lg:pt-4">
				<PromoBannerCard banner={WEBSITE_BANNER} priority />
			</section>
		</>
	);
}

import { ScrollContainer } from "@/features/home/components/shared/ScrollContainer";
import { OfferDiscountCard } from "./OfferDiscountCard";
import { PromoBannerCard } from "./PromoBannerCard";
import { OFFER_DISCOUNTS, WEBSITE_BANNER } from "./promo-banners.config";

export function PromoBanners({ isArabic }: { isArabic: boolean }) {
	return (
		<>


			<section aria-label={isArabic ? "موقع شلة" : "Website banner"} className="min-w-0 pt-2 sm:pt-3 lg:pt-4">
				<PromoBannerCard banner={WEBSITE_BANNER} priority isArabic={isArabic} />
			</section>
		</>
	);
}

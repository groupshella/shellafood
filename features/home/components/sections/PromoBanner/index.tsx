import { ScrollContainer } from "@/features/home/components/shared/ScrollContainer";
import { OfferDiscountCard } from "./OfferDiscountCard";
import { PromoBannerCard } from "./PromoBannerCard";
import { OFFER_DISCOUNTS, WEBSITE_BANNER } from "./promo-banners.config";

export function PromoBanners() {
	return (
		<>
			<section aria-label="عروض وخصومات" className="w-full min-w-0 space-y-2.5 pt-1 sm:space-y-3 sm:pt-2 lg:space-y-4">
				<h2 className="text-right text-base font-bold leading-snug text-[#111B18] dark:text-gray-100 sm:text-lg md:text-xl">
					عروض وخصومات
				</h2>
				<ScrollContainer
					className="-mx-3 px-3 pb-2 pt-1 sm:-mx-4 sm:px-4 lg:-mx-6 lg:px-6 2xl:mx-0 2xl:px-0"
					ariaLabel="قائمة العروض"
				>
					{OFFER_DISCOUNTS.map((offer) => (
						<OfferDiscountCard key={offer.id} percent={offer.percent} href={offer.href} />
					))}
				</ScrollContainer>
			</section>

			<section aria-label="موقع شلة" className="min-w-0 pt-2 sm:pt-3 lg:pt-4">
				<PromoBannerCard banner={WEBSITE_BANNER} priority />
			</section>
		</>
	);
}

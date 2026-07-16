import { getOffers } from "@/features/markets/api/offers";
import { OffersClient } from "./OffersClient";
import { OfferSlide } from "./OfferSlide";
import OffersSkeleton from "./skeleton";

export const Offers = Object.assign(
	async function Offers({
		moduleId,
		isArabic,
	}: {
		moduleId: string;
		isArabic: boolean;
	}) {
		const lang = isArabic ? "ar" : "en";
		const offers = await getOffers(moduleId, lang);
		if (offers.length === 0) return null;
		if (offers.length === 1) {
			return <OfferSlide offer={offers[0]} priority isArabic={isArabic} />;
		}

		return <OffersClient offers={offers} isArabic={isArabic} />;
	},
	{ skeleton: OffersSkeleton },
);

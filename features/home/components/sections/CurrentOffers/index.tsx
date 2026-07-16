import { getCurrentOffers } from "@/features/home/api/current-offers";
import { isArabicLocale } from "@/shared/lib/locale";
import { CurrentOffersClient } from "./CurrentOffersClient";
import CurrentOfferSkeleton from "./skeleton";

export const CurrentOffers = Object.assign(
	async function CurrentOffers() {
		const isArabic = await isArabicLocale();
		const lang = isArabic ? "ar" : "en";
		const offers = await getCurrentOffers(lang);
		if (offers.length === 0) return null;

		return <CurrentOffersClient offers={offers} isArabic={isArabic} />;
	},
	{ skeleton: CurrentOfferSkeleton }
);

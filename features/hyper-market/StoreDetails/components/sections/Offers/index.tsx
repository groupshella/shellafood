import { getHyperMarketOffers } from "@/features/hyper-market/StoreDetails/api/offers";
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
        const offers = await getHyperMarketOffers(moduleId, lang);
        if (offers.length === 0) return null;

        if (offers.length === 1) {
            return (
                <section
                    aria-label={isArabic ? "العروض" : "Offers"}
                    className="w-full min-w-0 px-3 pb-2 sm:px-5 sm:pb-3 md:px-6 lg:px-6 lg:pb-4 xl:px-8 2xl:px-10"
                >
                    <OfferSlide offer={offers[0]} priority isArabic={isArabic} />
                </section>
            );
        }

        return <OffersClient offers={offers} isArabic={isArabic} />;
    },
    { skeleton: OffersSkeleton }
);

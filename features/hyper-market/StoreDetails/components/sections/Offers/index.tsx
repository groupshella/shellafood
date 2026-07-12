import { getHyperMarketOffers } from "@/features/hyper-market/StoreDetails/api/offers";
import { OffersClient } from "./OffersClient";
import { OfferSlide } from "./OfferSlide";
import OffersSkeleton from "./skeleton";

export const Offers = Object.assign(
    async function Offers({ moduleId, isArabic }: { moduleId: string; isArabic: boolean }) {
        const offers = await getHyperMarketOffers(moduleId, isArabic);
        if (offers.length === 0) return null;

        if (offers.length === 1) {
            return (
                <section aria-label={isArabic ? "العروض" : "Offers"} className="w-full px-4 sm:px-5" dir={isArabic ? "rtl" : "ltr"}>

                    <OfferSlide offer={offers[0]} isArabic={isArabic} priority />
                </section>
            );
        }

        return <OffersClient offers={offers} isArabic={isArabic} />;
    },
    { skeleton: OffersSkeleton }
);

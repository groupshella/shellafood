import { getHyperMarketOffers } from "@/features/hyper-market/StoreDetails/api/offers";
import { OffersClient } from "./OffersClient";
import { OfferSlide } from "./OfferSlide";
import OffersSkeleton from "./skeleton";

export const Offers = Object.assign(
    async function Offers({ moduleId }: { moduleId: string }) {
        const offers = await getHyperMarketOffers(moduleId);
        if (offers.length === 0) return null;

        if (offers.length === 1) {
            return (
                <section aria-label="العروض" className="w-full px-4 sm:px-5">

                    <OfferSlide offer={offers[0]} priority />
                </section>
            );
        }

        return <OffersClient offers={offers} />;
    },
    { skeleton: OffersSkeleton }
);

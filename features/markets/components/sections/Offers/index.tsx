import { getOffers } from "@/features/markets/api/offers";
import { OffersClient } from "./OffersClient";
import { OfferSlide } from "./OfferSlide";
import OffersSkeleton from "./skeleton";

export const Offers = Object.assign(
    async function Offers({ moduleId }: { moduleId: string }) {
        const offers = await getOffers(moduleId);
        if (offers.length === 0) return null;
        if (offers.length === 1) return <OfferSlide offer={offers[0]} priority />;

        return <OffersClient offers={offers} />;
    },
    { skeleton: OffersSkeleton },
);

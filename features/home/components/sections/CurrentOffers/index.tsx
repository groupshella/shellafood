import { getCurrentOffers } from "@/features/home/api/current-offers";
import { CurrentOffersClient } from "./CurrentOffersClient";
import CurrentOfferSkeleton from "./skeleton";

export const CurrentOffers = Object.assign(
    async function CurrentOffers() {
        const offers = await getCurrentOffers();
        if (offers.length === 0) return null;

        return <CurrentOffersClient offers={offers} />;
    },
    { skeleton: CurrentOfferSkeleton }
);

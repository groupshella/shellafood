import { getCurrentOffers } from "@/features/markets/api/current-offers";
import { CurrentOffersClient } from "./CurrentOffersClient";
import CurrentOffersSkeleton from "./skeleton";

export const CurrentOffers = Object.assign(
    async function CurrentOffers({ moduleId }: { moduleId: string }) {
        const offers = await getCurrentOffers(moduleId);
        if (offers.length === 0) return null;

        return <CurrentOffersClient offers={offers} />;
    },
    { skeleton: CurrentOffersSkeleton },
);

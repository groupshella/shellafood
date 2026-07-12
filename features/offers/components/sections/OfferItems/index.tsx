import { getOfferItems } from "@/features/offers/api/getOfferItems";
import { OfferItemsClient } from "./OfferItemsClient";
import { Empty } from "./Empty";
import OfferItemsSkeleton from "./skeleton";

interface OfferItemsProps {
    offerId: string;
    moduleId?: string;
    isArabic: boolean;
}

export const OfferItems = Object.assign(
    async function OfferItems({ offerId, moduleId = "3", isArabic }: OfferItemsProps) {
        const { items, total, offset, limit, hasMore } = await getOfferItems(
            offerId,
            1,
            50,
            moduleId,
            isArabic
        );

        return (
            <OfferItemsClient
                items={items}
                total={total}
                offerId={offerId}
                moduleId={moduleId}
                hasMore={hasMore}
                initialOffset={offset}
                pageLimit={limit}
                isArabic={isArabic}
            />
        );
    },
    { skeleton: OfferItemsSkeleton }
);

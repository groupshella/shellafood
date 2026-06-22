import { getRelatedItems } from "@/features/item/api/related-items";
import { RelatedItemsClient } from "./RelatedItemsClient";
import RelatedItemsSkeleton from "./skeleton";

export const RelatedItems = Object.assign(
    async function RelatedItems({ itemId }: { itemId: string }) {
        const items = await getRelatedItems(itemId);
        if (items.length === 0) return null;

        return <RelatedItemsClient items={items} />;
    },
    { skeleton: RelatedItemsSkeleton }
);

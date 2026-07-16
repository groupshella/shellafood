import { getRelatedItems } from "@/features/item/api/related-items";
import { RelatedItemsClient } from "./RelatedItemsClient";
import RelatedItemsSkeleton from "./skeleton";

export const RelatedItems = Object.assign(
    async function RelatedItems({
        itemId,
        isArabic,
    }: {
        itemId: string;
        isArabic: boolean;
    }) {
        const lang = isArabic ? "ar" : "en";
        const items = await getRelatedItems(itemId, lang);
        if (items.length === 0) return null;

        return <RelatedItemsClient items={items} isArabic={isArabic} />;
    },
    { skeleton: RelatedItemsSkeleton }
);

import { getItemDetails } from "@/features/item/api/item-details";
import { ItemInfoClient } from "./ItemInfoClient";
import ItemInfoSkeleton from "./skeleton";

export const ItemInfo = Object.assign(
    async function ItemInfo({
        itemId,
        isArabic,
    }: {
        itemId: string;
        isArabic: boolean;
    }) {
        const lang = isArabic ? "ar" : "en";
        const item = await getItemDetails(itemId, lang);
        return <ItemInfoClient item={item} isArabic={isArabic} />;
    },
    { skeleton: ItemInfoSkeleton }
);

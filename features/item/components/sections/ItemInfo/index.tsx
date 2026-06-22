import { getItemDetails } from "@/features/item/api/item-details";
import { ItemInfoClient } from "./ItemInfoClient";
import ItemInfoSkeleton from "./skeleton";

export const ItemInfo = Object.assign(
    async function ItemInfo({ itemId }: { itemId: string }) {
        const item = await getItemDetails(itemId);
        return <ItemInfoClient item={item} />;
    },
    { skeleton: ItemInfoSkeleton }
);

import { getItemDetails } from "@/features/item/api/item-details";
import { ItemInfoClient } from "./ItemInfoClient";
import ItemInfoSkeleton from "./skeleton";

export const ItemInfo = Object.assign(
    async function ItemInfo({ itemId, moduleId }: { itemId: string; moduleId?: string }) {
        const item = await getItemDetails(itemId, moduleId);
        return <ItemInfoClient item={item} />;
    },
    { skeleton: ItemInfoSkeleton }
);

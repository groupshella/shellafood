import { getItemDetails } from "@/features/item/api/item-details";
import { AddToCartClient } from "./AddToCartClient";

export const AddToCart = Object.assign(
    async function AddToCart({ itemId }: { itemId: string }) {
        const item = await getItemDetails(itemId);
        return <AddToCartClient itemId={itemId} inStock={item.is_available} />;
    },
    { skeleton: AddToCartSkeleton }
);

function AddToCartSkeleton() {
    return (
        <div className="sticky bottom-0 mt-2 animate-pulse border-t border-gray-100 bg-white px-4 py-3 sm:px-5">
            <div className="flex items-center gap-3">
                <div className="h-10 w-28 rounded-full bg-gray-100" />
                <div className="h-12 flex-1 rounded-full bg-gray-200" />
            </div>
        </div>
    );
}

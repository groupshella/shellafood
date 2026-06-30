import { getStoreDetails } from "@/features/stores/api/store-details";
import { getStoreCategories } from "@/features/stores/api/store-categories";
import { StoreHeaderClient } from "./StoreHeaderClient";
import StoreHeaderSkeleton from "./skeleton";

interface StoreHeaderProps {
    storeId: string;
    moduleId: string;
    /** Pre-resolved active category ID from URL param; auto-selects first if absent. */
    activeCategoryId?: string;
}

export const StoreHeader = Object.assign(
    async function StoreHeader({ storeId, moduleId, activeCategoryId }: StoreHeaderProps) {
        const [store, categories] = await Promise.all([
            getStoreDetails(storeId),
            getStoreCategories(storeId),
        ]);

        const resolvedCategoryId =
            activeCategoryId || (categories[0] ? String(categories[0].id) : "");

        return (
            <StoreHeaderClient
                store={store}
                categories={categories}
                activeCategoryId={resolvedCategoryId}
                storeId={storeId}
                moduleId={moduleId}
            />
        );
    },
    { skeleton: StoreHeaderSkeleton }
);

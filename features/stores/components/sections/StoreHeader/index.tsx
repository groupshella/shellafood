import {
    resolveStoreCategoryId,
    type StoreDetails,
} from "@/features/stores/types/store.types";
import { StoreHeaderClient } from "./StoreHeaderClient";
import StoreHeaderSkeleton from "./skeleton";

interface StoreHeaderProps {
    store: StoreDetails;
    storeId: string;
    moduleId: string;
    activeCategoryId?: string;
}

export const StoreHeader = Object.assign(
    function StoreHeader({ store, storeId, moduleId, activeCategoryId }: StoreHeaderProps) {
        const resolvedCategoryId = resolveStoreCategoryId(store, activeCategoryId);

        return (
            <StoreHeaderClient
                store={store}
                categories={store.categories}
                activeCategoryId={resolvedCategoryId}
                storeId={storeId}
                moduleId={moduleId}
            />
        );
    },
    { skeleton: StoreHeaderSkeleton }
);

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
    isArabic: boolean;
}

export const StoreHeader = Object.assign(
    async function StoreHeader({ store, storeId, moduleId, activeCategoryId, isArabic }: StoreHeaderProps) {
        const resolvedCategoryId = resolveStoreCategoryId(store, activeCategoryId);
        return (
            <StoreHeaderClient
                store={store}
                categories={store.categories}
                activeCategoryId={resolvedCategoryId}
                storeId={storeId}
                moduleId={moduleId}
                isArabic={isArabic}
            />
        );
    },
    { skeleton: StoreHeaderSkeleton }
);

import { getStoreDetails } from "@/features/hyper-market/StoreDetails/api/store-details";
import { StoreDetailsClient } from "./StoreDetailsClient";
import StoreDetailsSkeleton from "./skeleton";

export const StoreDetails = Object.assign(
    async function StoreDetails({ storeId, moduleId, isArabic }: { storeId: string; moduleId?: string; isArabic: boolean }) {
        const store = await getStoreDetails(storeId, isArabic);

        return <StoreDetailsClient store={store} moduleId={moduleId} isArabic={isArabic} />;
    },
    { skeleton: StoreDetailsSkeleton }
);

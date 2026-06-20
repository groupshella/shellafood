import { getStoreDetails } from "@/features/hyper-market/StoreDetails/api/store-details";
import { StoreDetailsClient } from "./StoreDetailsClient";
import StoreDetailsSkeleton from "./skeleton";

export const StoreDetails = Object.assign(
    async function StoreDetails({ storeId, moduleId }: { storeId: string; moduleId?: string }) {
        const store = await getStoreDetails(storeId);
        return <StoreDetailsClient store={store} moduleId={moduleId} />;
    },
    { skeleton: StoreDetailsSkeleton }
);

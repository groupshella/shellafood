import { getStoreDetails } from "@/features/hyper-market/StoreDetails/api/store-details";
import { StoreDetailsClient } from "./StoreDetailsClient";
import StoreDetailsSkeleton from "./skeleton";

export const StoreDetails = Object.assign(
    async function StoreDetails({
        storeId,
        moduleId,
        isArabic,
    }: {
        storeId: string;
        moduleId?: string;
        isArabic: boolean;
    }) {
        const lang = isArabic ? "ar" : "en";
        const store = await getStoreDetails(storeId, lang);

        return (
            <StoreDetailsClient store={store} moduleId={moduleId} isArabic={isArabic} />
        );
    },
    { skeleton: StoreDetailsSkeleton }
);

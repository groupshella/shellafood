import { getDiscountedStores } from "@/features/home/api/discounted-stores";
import { DiscountedStoresClient } from "./DiscountedStoresClient";
import DiscountedStoreSkeleton from "./skeleton";

export const DiscountedStores = Object.assign(
    async function DiscountedStores() {
        const stores = await getDiscountedStores();
        if (stores.length === 0) return null;

        return <DiscountedStoresClient stores={stores} />;
    },
    { skeleton: DiscountedStoreSkeleton }
);

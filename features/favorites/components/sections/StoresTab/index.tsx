import { getFavoriteStores } from "@/features/favorites/api/favorites";
import { StoresTabClient } from "./StoresTabClient";
import StoresTabSkeleton from "./skeleton";

export const StoresTab = Object.assign(
    async function StoresTab() {
        const stores = await getFavoriteStores();
        return <StoresTabClient stores={stores} />;
    },
    { skeleton: StoresTabSkeleton }
);

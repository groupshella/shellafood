import { getWishlist } from "@/features/favorites/api/favorites";
import { StoresTabClient } from "./StoresTabClient";
import StoresTabSkeleton from "./skeleton";

export const StoresTab = Object.assign(
    async function StoresTab() {
        const data = await getWishlist();
        const stores = data.store ?? [];
        return <StoresTabClient stores={stores} />;
    },
    { skeleton: StoresTabSkeleton }
);

import { getWishlist } from "@/features/favorites/api/favorites";
import { StoresTabClient } from "./StoresTabClient";
import StoresTabSkeleton from "./skeleton";

export const StoresTab = Object.assign(
    async function StoresTab({ isArabic }: { isArabic: boolean }) {
        const data = await getWishlist({ isArabic });
        const stores = data.store ?? [];
        return <StoresTabClient stores={stores} isArabic={isArabic} />;
    },
    { skeleton: StoresTabSkeleton }
);

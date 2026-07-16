import { getFavoriteStores } from "@/features/favorites/api/favorites";
import { isArabicLocale } from "@/shared/lib/locale";
import { StoresTabClient } from "./StoresTabClient";
import StoresTabSkeleton from "./skeleton";

export const StoresTab = Object.assign(
    async function StoresTab() {
        const isArabic = await isArabicLocale();
        const stores = await getFavoriteStores(isArabic ? "ar" : "en");
        return <StoresTabClient stores={stores} isArabic={isArabic} />;
    },
    { skeleton: StoresTabSkeleton }
);

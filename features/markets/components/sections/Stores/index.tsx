import { getCategories } from "@/features/markets/api/categories";
import { getStores } from "@/features/markets/api/stores";
import { DEFAULT_FILTERS } from "@/features/markets/types/stores.types";
import { StoresClient } from "./StoresClient";
import StoresSkeleton from "./skeleton";

const PAGE_SIZE = 30;

export const Stores = Object.assign(
    async function Stores({ moduleId, isArabic }: { moduleId: string, isArabic: boolean }) {
        const [categories, initialStores] = await Promise.all([
            getCategories(moduleId, isArabic),
            getStores(moduleId, DEFAULT_FILTERS, PAGE_SIZE, 0, isArabic),
        ]);

        return (
            <StoresClient
                categories={categories}
                initialStores={initialStores}
                isArabic={isArabic}
            />
        );
    },
    { skeleton: StoresSkeleton },
);

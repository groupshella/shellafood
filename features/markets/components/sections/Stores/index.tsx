import { getCategories } from "@/features/markets/api/categories";
import { getStores } from "@/features/markets/api/stores";
import { DEFAULT_FILTERS } from "@/features/markets/types/stores.types";
import { StoresClient } from "./StoresClient";
import StoresSkeleton from "./skeleton";

const PAGE_SIZE = 30;

export const Stores = Object.assign(
    async function Stores({ moduleId }: { moduleId: string }) {
        const [categories, initialStores] = await Promise.all([
            getCategories(moduleId),
            getStores(moduleId, DEFAULT_FILTERS, PAGE_SIZE, 1),
        ]);

        return (
            <StoresClient
                categories={categories}
                initialStores={initialStores}
            />
        );
    },
    { skeleton: StoresSkeleton },
);

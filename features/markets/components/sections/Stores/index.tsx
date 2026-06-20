import { getCategories } from "@/features/markets/api/categories";
import { StoresClient } from "./StoresClient";
import StoresSkeleton from "./skeleton";

export const Stores = Object.assign(
    async function Stores({ moduleId }: { moduleId: string }) {
        const categories = await getCategories(moduleId);
        return <StoresClient moduleId={moduleId} categories={categories} />;
    },
    { skeleton: StoresSkeleton },
);

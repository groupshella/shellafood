import { getStoreCategories } from "@/features/hyper-market/Categories/api/categories";
import { CategoryTabsClient } from "./CategoryTabsClient";
import CategoryTabsSkeleton from "./skeleton";

export const CategoryTabs = Object.assign(
    async function CategoryTabs({
        storeId,
        activeCategoryId,
    }: {
        storeId: string;
        activeCategoryId: string;
    }) {
        const categories = await getStoreCategories(storeId);
        if (categories.length === 0) return null;

        return <CategoryTabsClient categories={categories} activeCategoryId={activeCategoryId} />;
    },
    { skeleton: CategoryTabsSkeleton }
);

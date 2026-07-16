import { getStoreCategories } from "@/features/hyper-market/Categories/api/categories";
import { CategoryTabsClient } from "./CategoryTabsClient";
import CategoryTabsSkeleton from "./skeleton";

export const CategoryTabs = Object.assign(
    async function CategoryTabs({
        storeId,
        activeCategoryId,
        isArabic,
    }: {
        storeId: string;
        activeCategoryId: string;
        isArabic: boolean;
    }) {
        const categories = await getStoreCategories(storeId, isArabic ? "ar" : "en");
        if (categories.length === 0) return null;

        return (
            <CategoryTabsClient
                categories={categories}
                activeCategoryId={activeCategoryId}
                isArabic={isArabic}
            />
        );
    },
    { skeleton: CategoryTabsSkeleton }
);

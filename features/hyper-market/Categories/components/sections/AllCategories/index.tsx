import { getStoreCategories } from "@/features/hyper-market/Categories/api/categories";
import { AllCategoriesClient } from "./AllCategoriesClient";
import AllCategoriesSkeleton from "./skeleton";

export const AllCategories = Object.assign(
    async function AllCategories({ storeId }: { storeId: string }) {
        const categories = await getStoreCategories(storeId);
        if (categories.length === 0) return null;

        return <AllCategoriesClient categories={categories} />;
    },
    { skeleton: AllCategoriesSkeleton },
);

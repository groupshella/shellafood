import { getCategories } from "@/features/markets/api/categories";
import { AllCategoriesClient } from "./AllCategoriesClient";
import AllCategoriesSkeleton from "./skeleton";

export const AllCategories = Object.assign(
    async function AllCategories({
        moduleId,
        moduleName,
    }: {
        moduleId: string;
        moduleName?: string;
    }) {
        const categories = await getCategories(moduleId);
        if (categories.length === 0) return null;

        return (
            <AllCategoriesClient
                categories={categories}
                moduleId={moduleId}
                moduleName={moduleName}
            />
        );
    },
    { skeleton: AllCategoriesSkeleton },
);

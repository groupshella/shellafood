import { getCategories } from "@/features/markets/api/categories";
import { CategoriesClient } from "./CategoriesClient";
import CategoriesSkeleton from "./skeleton";

export const Categories = Object.assign(
    async function Categories({
        moduleId,
        moduleName,
    }: {
        moduleId: string;
        moduleName?: string;
    }) {
        const categories = await getCategories(moduleId);
        if (categories.length === 0) return null;

        return (
            <CategoriesClient
                categories={categories}
                moduleId={moduleId}
                moduleName={moduleName}
            />
        );
    },
    { skeleton: CategoriesSkeleton },
);

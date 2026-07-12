import { getCategories } from "@/features/markets/api/categories";
import { CategoriesClient } from "./CategoriesClient";
import CategoriesSkeleton from "./skeleton";

export const Categories = Object.assign(
    async function Categories({
        moduleId,
        moduleName,
        isArabic,
    }: {
        moduleId: string;
        moduleName?: string;
        isArabic: boolean;
    }) {
        const categories = await getCategories(moduleId, isArabic);
        if (categories.length === 0) return null;

        return (
            <CategoriesClient
                categories={categories}
                moduleId={moduleId}
                moduleName={moduleName}
                isArabic={isArabic}
            />
        );
    },
    { skeleton: CategoriesSkeleton },
);

import { getStoreCategories } from "@/features/stores/api/store-categories";
import { getCategoryDetail } from "@/features/stores/api/category-detail";
import { StoreCategoryProductsClient } from "./StoreCategoryProductsClient";
import StoreCategoryProductsSkeleton from "./skeleton";

interface StoreCategoryProductsProps {
    storeId: string;
    moduleId: string;
    categoryId?: string;
}

export const StoreCategoryProducts = Object.assign(
    async function StoreCategoryProducts({
        storeId,
        moduleId,
        categoryId,
    }: StoreCategoryProductsProps) {
        let resolvedCategoryId = categoryId;

        if (!resolvedCategoryId) {
            const categories = await getStoreCategories(storeId);
            if (categories.length === 0) return null;
            resolvedCategoryId = String(categories[0].id);
        }

        const detail = await getCategoryDetail(storeId, resolvedCategoryId);

        if (!detail.sub_categories.length) return null;

        return (
            <div>
                <div className="bg-white px-3 py-2.5 sm:px-4 sm:py-3 md:px-5 lg:mx-auto lg:max-w-4xl lg:px-6 xl:max-w-5xl 2xl:max-w-6xl">
                    <h2 className="text-right text-base font-bold leading-snug text-[#111B18] sm:text-lg md:text-xl">
                        {"كل المنتجات"}
                    </h2>
                </div>

                <StoreCategoryProductsClient detail={detail} moduleId={moduleId} />
            </div>
        );
    },
    { skeleton: StoreCategoryProductsSkeleton }
);

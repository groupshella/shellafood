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
                {/* Section heading */}
                <div className="bg-white px-4 py-3">
                    <h2 className="text-right text-lg font-bold leading-snug text-[#111B18]">
                        {"كل المنتجات"}
                    </h2>
                </div>

                <StoreCategoryProductsClient detail={detail} moduleId={moduleId} />
            </div>
        );
    },
    { skeleton: StoreCategoryProductsSkeleton }
);

import { getCategoryDetail } from "@/features/stores/api/category-detail";
import {
    categoryProductsToDetail,
    type StoreCategoryProducts as StoreCategoryProductsData,
} from "@/features/stores/types/store.types";
import { StoreCategoryProductsClient } from "./StoreCategoryProductsClient";
import StoreCategoryProductsSkeleton from "./skeleton";

interface StoreCategoryProductsProps {
    storeId: string;
    moduleId: string;
    categoryId: string;
    /** Embedded products from store details — used when it matches `categoryId`. */
    categoryProducts?: StoreCategoryProductsData;
    /** Scroll products into view (e.g. after picking a category from the tabs). */
    scrollIntoView?: boolean;
}

export const StoreCategoryProducts = Object.assign(
    async function StoreCategoryProducts({
        storeId,
        moduleId,
        categoryId,
        categoryProducts,
        scrollIntoView = false,
    }: StoreCategoryProductsProps) {
        if (!categoryId) return null;

        const canUseEmbedded =
            categoryProducts != null && String(categoryProducts.category_id) === categoryId;

        const detail = canUseEmbedded
            ? categoryProductsToDetail(categoryProducts)
            : await getCategoryDetail(storeId, categoryId);

        if (!detail.sub_categories.length) return null;

        return (
            <div>
                <div className="bg-white px-3 py-2.5 sm:px-4 sm:py-3 md:px-5 lg:mx-auto lg:max-w-4xl lg:px-6 xl:max-w-5xl 2xl:max-w-6xl">
                    <h2 className="text-start text-base font-bold leading-snug text-[#111B18] dark:text-gray-50 sm:text-lg md:text-xl">
                        كل المنتجات
                    </h2>
                </div>

                <StoreCategoryProductsClient
                    detail={detail}
                    moduleId={moduleId}
                    scrollIntoView={scrollIntoView}
                />
            </div>
        );
    },
    { skeleton: StoreCategoryProductsSkeleton }
);

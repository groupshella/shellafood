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
    isArabic: boolean;
}

export const StoreCategoryProducts = Object.assign(
    async function StoreCategoryProducts({
        storeId,
        moduleId,
        categoryId,
        categoryProducts,
        scrollIntoView = false,
        isArabic,
    }: StoreCategoryProductsProps) {
        if (!categoryId) return null;

        const lang = isArabic ? "ar" : "en";
        const canUseEmbedded =
            categoryProducts != null && String(categoryProducts.category_id) === categoryId;

        const detail = canUseEmbedded
            ? categoryProductsToDetail(categoryProducts)
            : await getCategoryDetail(storeId, categoryId, lang);

        if (!detail.sub_categories.length) return null;

        return (
            <div>
                <div className="bg-background px-3 py-2.5 sm:px-4 sm:py-3 md:px-5 md:py-3.5 lg:mx-auto lg:max-w-4xl lg:px-6 xl:max-w-5xl 2xl:max-w-6xl">
                    <h2 className="text-start text-base font-bold leading-snug text-foreground sm:text-lg md:text-xl lg:text-[1.375rem]">
                        {isArabic ? "كل المنتجات" : "All products"}
                    </h2>
                </div>

                <StoreCategoryProductsClient
                    detail={detail}
                    moduleId={moduleId}
                    scrollIntoView={scrollIntoView}
                    isArabic={isArabic}
                />
            </div>
        );
    },
    { skeleton: StoreCategoryProductsSkeleton }
);

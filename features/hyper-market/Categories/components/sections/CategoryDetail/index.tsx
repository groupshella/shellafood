import { getCategoryDetail } from "@/features/hyper-market/Categories/api/category-detail";
import { CategoryDetailClient } from "./CategoryDetailClient";
import CategoryDetailSkeleton from "./skeleton";

export const CategoryDetail = Object.assign(
    async function CategoryDetail({
        storeId,
        categoryId,
        isArabic,
    }: {
        storeId: string;
        categoryId: string;
        isArabic: boolean;
    }) {
        const detail = await getCategoryDetail(storeId, categoryId, isArabic, 40);
        if (!detail.sub_categories.length) return null;

        return <CategoryDetailClient detail={detail} isArabic={isArabic} />;
    },
    { skeleton: CategoryDetailSkeleton }
);

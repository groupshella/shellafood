import { getCategoryDetail } from "@/features/hyper-market/Categories/api/category-detail";
import { CategoryDetailClient } from "./CategoryDetailClient";
import CategoryDetailSkeleton from "./skeleton";

export const CategoryDetail = Object.assign(
    async function CategoryDetail({
        storeId,
        categoryId,
    }: {
        storeId: string;
        categoryId: string;
    }) {
        const detail = await getCategoryDetail(storeId, categoryId, 200, 1);
        if (!detail.sub_categories.length) return null;

        return <CategoryDetailClient detail={detail} storeId={storeId} />;
    },
    { skeleton: CategoryDetailSkeleton }
);
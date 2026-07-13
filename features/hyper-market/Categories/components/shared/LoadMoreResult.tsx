"use server";

import { getCategoryDetail } from "@/features/hyper-market/Categories/api/category-detail";
import type { SubCategory } from "@/features/hyper-market/Categories/types/category-detail.types";

interface LoadMoreParams {
    storeId: string;
    subCategoryId: number;
    limit: number;
    /** Page number (1-based), not item index */
    offset: number;
}

export type LoadMoreResult =
    | { success: true; subCategory: SubCategory }
    | { success: false; message: string };

const GENERIC_ERROR = "تعذر تحميل المزيد من المنتجات، حاول مرة أخرى";

/**
 * Loads the next page for one sub-category.
 * `offset` is the page number (2, 3, …) — same convention as markets/orders.
 */
export async function loadMoreSubCategoryProducts({
    storeId,
    subCategoryId,
    limit,
    offset,
}: LoadMoreParams): Promise<LoadMoreResult> {
    // Server Actions serialize NaN as null — always coerce to a valid page.
    const page = Math.max(2, Number(offset) || 2);

    try {
        const detail = await getCategoryDetail(
            storeId,
            subCategoryId,
            limit,
            page,
            { cache: "no-store" },
        );

        const subCategory =
            detail.sub_categories.find((sc) => sc.id === subCategoryId) ??
            detail.sub_categories[0];

        if (!subCategory) {
            return { success: false, message: GENERIC_ERROR };
        }

        return { success: true, subCategory };
    } catch {
        return { success: false, message: GENERIC_ERROR };
    }
}

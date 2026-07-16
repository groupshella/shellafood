"use server";

import { getCategoryDetail } from "@/features/hyper-market/Categories/api/category-detail";
import type { SubCategory } from "@/features/hyper-market/Categories/types/category-detail.types";
import { getLocale } from "@/shared/lib/locale";

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
    const lang = await getLocale();
    const isArabic = lang === "ar";
    const genericError = isArabic
        ? "تعذر تحميل المزيد من المنتجات، حاول مرة أخرى"
        : "Could not load more products, please try again";

    try {
        const detail = await getCategoryDetail(
            storeId,
            subCategoryId,
            lang,
            limit,
            page,
            { cache: "no-store" },
        );

        const subCategory =
            detail.sub_categories.find((sc) => sc.id === subCategoryId) ??
            detail.sub_categories[0];

        if (!subCategory) {
            return { success: false, message: genericError };
        }

        return { success: true, subCategory };
    } catch {
        return { success: false, message: genericError };
    }
}

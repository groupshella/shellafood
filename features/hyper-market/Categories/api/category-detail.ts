import { CategoryDetails } from "@/features/hyper-market/Categories/types/category-detail.types";

/**
 * Fetches a category node's detail: its own products (as the first
 * sub_category, sharing the same id as `categoryId`) plus any nested
 * child categories, each with their own paginated product slice.
 *
 * `offset` is a **page number** (1, 2, 3…), matching the rest of the API.
 * Sub-category ids are valid category ids, so pagination reuses this
 * function with `categoryId = subCategory.id` and the next page.
 */
export async function getCategoryDetail(
    storeId: string,
    categoryId: string | number,
    limit = 20,
    offset = 1,
    options?: { cache?: RequestCache },
): Promise<CategoryDetails> {
    const page = Math.max(1, offset);
    const cache = options?.cache ?? (page > 1 ? "no-store" : undefined);

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v2/stores/${storeId}/categories/${categoryId}?limit=${limit}&offset=${page}`,
        {
            headers: {
                Accept: "application/json",
                "Accept-Language": "ar",
                "X-Localization": "ar",
                zoneId: process.env.ZONE_ID!,
            },
            ...(cache
                ? { cache }
                : {
                      next: {
                          revalidate: Number(process.env.REVALIDATE_TIME) || 3600,
                          tags: [
                              "hyper-market",
                              `store-${storeId}-category-${categoryId}`,
                          ],
                      },
                  }),
        },
    );

    if (!res.ok) throw new Error(`Failed to fetch category detail: ${res.status}`);

    return res.json() as Promise<CategoryDetails>;
}
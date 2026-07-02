import { CategoryDetails } from "@/features/hyper-market/Categories/types/category-detail.types";

export async function getCategoryDetail(
    storeId: string,
    categoryId: string,
    limit = 40
): Promise<CategoryDetails> {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v2/stores/${storeId}/categories/${categoryId}?limit=${limit}`,
        {
            headers: {
                Accept: "application/json",
                "Accept-Language": "ar",
                "X-Localization": "ar",
                zoneId: process.env.ZONE_ID!,
            },
            next: {
                revalidate: Number(process.env.REVALIDATE_TIME) || 3600,
                tags: ["hyper-market", `store-${storeId}-category-${categoryId}`],
            },
        }
    );

    if (!res.ok) throw new Error(`Failed to fetch category detail: ${res.status}`);

    return res.json() as Promise<CategoryDetails>;
}

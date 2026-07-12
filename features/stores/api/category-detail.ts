import { getServerLocale } from "@/features/language/getServerLocale";
import { CategoryDetail } from "@/features/stores/types/store.types";

export async function getCategoryDetail(
    storeId: string,
    categoryId: string,
    limit = 20
): Promise<CategoryDetail> {
    const locale = await getServerLocale();
    const isArabic = locale === "ar";

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v2/stores/${storeId}/categories/${categoryId}?limit=${limit}`,
        {
            headers: {
                Accept: "application/json",
                "Accept-Language": isArabic ? "ar" : "en",
                "X-Localization": isArabic ? "ar" : "en",
                zoneId: process.env.ZONE_ID!,
            },
            next: {
                revalidate: Number(process.env.REVALIDATE_TIME) || 3600,
                tags: ["stores", `store-${storeId}-category-${categoryId}`],
            },
        }
    );

    if (!res.ok) throw new Error(`Failed to fetch category detail: ${res.status}`);

    return res.json() as Promise<CategoryDetail>;
}

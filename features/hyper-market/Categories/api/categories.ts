import { GetStoreCategoriesResponse, StoreCategory } from "@/features/hyper-market/Categories/types/categories.types";

export async function getStoreCategories(
    storeId: string,
    lang: "ar" | "en"
): Promise<StoreCategory[]> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v2/stores/${storeId}/categories`, {
        headers: {
            Accept: "application/json",
            "Accept-Language": lang,
            "X-Localization": lang,
            lang,
            zoneId: process.env.ZONE_ID!,
        },
        next: {
            revalidate: Number(process.env.REVALIDATE_TIME) || 3600,
            tags: ["hyper-market", `store-${storeId}-categories`, `store-${storeId}-categories-${lang}`],
        },
    });

    if (!res.ok) throw new Error(`Failed to fetch store categories: ${res.status}`);

    const data: GetStoreCategoriesResponse = await res.json();
    return Array.isArray(data) ? data : [];
}

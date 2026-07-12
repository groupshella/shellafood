import { GetStoreCategoriesResponse, StoreCategory } from "@/features/hyper-market/Categories/types/categories.types";

export async function getStoreCategories(storeId: string, isArabic: boolean = false): Promise<StoreCategory[]> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v2/stores/${storeId}/categories`, {
        headers: {
            Accept: "application/json",
            "Accept-Language": isArabic ? "ar" : "en",
            "X-Localization": isArabic ? "ar" : "en",
            zoneId: process.env.ZONE_ID!,
        },
        next: {
            revalidate: Number(process.env.REVALIDATE_TIME) || 3600,
            tags: ["hyper-market", `store-${storeId}-categories`],
        },
    });

    if (!res.ok) throw new Error(`Failed to fetch store categories: ${res.status}`);

    const data: GetStoreCategoriesResponse = await res.json();
    return Array.isArray(data) ? data : [];
}

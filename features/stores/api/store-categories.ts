import { StoreCategory } from "@/features/stores/types/store.types";

export async function getStoreCategories(storeId: string): Promise<StoreCategory[]> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v2/stores/${storeId}/categories`, {
        headers: {
            Accept: "application/json",
            "Accept-Language": "ar",
            "X-Localization": "ar",
            zoneId: process.env.ZONE_ID!,
        },
        next: {
            revalidate: Number(process.env.REVALIDATE_TIME) || 3600,
            tags: ["stores", `store-${storeId}-categories`],
        },
    });

    if (!res.ok) throw new Error(`Failed to fetch store categories: ${res.status}`);

    const data = await res.json();
    return Array.isArray(data) ? data : [];
}

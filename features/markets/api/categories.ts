import {
    BackendCategoriesResponse,
    Category,
    GetCategoriesResponse,
} from "@/features/markets/types/categories.types";

export async function getCategories(moduleId: string): Promise<Category[]> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v2/categories`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "X-localization": "ar",
            "Accept-Language": "ar",
            moduleId,
            zoneId: process.env.ZONE_ID!,
            latitude: process.env.NEXT_PUBLIC_LATITUDE!,
            longitude: process.env.NEXT_PUBLIC_LONGITUDE!,
        },
        next: { revalidate: Number(process.env.REVALIDATE_TIME) },
    });

    if (!res.ok) throw new Error(`Failed to fetch categories: ${res.status}`);

    const json: BackendCategoriesResponse = await res.json();
    const categories: GetCategoriesResponse = json.data ?? [];
    return categories;
}

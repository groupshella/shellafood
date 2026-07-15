import { mapItemsSearchResponse } from "@/features/brands/lib/normalize-brand-item";
import type {
    BrandItem,
    ItemsSearchApiResponse,
} from "@/features/brands/types/brands.types";

function itemsSearchHeaders(): HeadersInit {
    return {
        Accept: "application/json",
        "Content-Type": "application/json; charset=UTF-8",
        "X-localization": "ar",
        zoneId: process.env.ZONE_ID!,
        "zone-id": process.env.ZONE_ID!,
        moduleId: process.env.MODULE_ID ?? "3",
        "module-id": process.env.MODULE_ID ?? "3",
        latitude: process.env.NEXT_PUBLIC_LATITUDE ?? "",
        longitude: process.env.NEXT_PUBLIC_LONGITUDE ?? "",
    };
}

export async function getBrandItems(
    brandId: string,
    page = 1,
    limit = 200
): Promise<{ items: BrandItem[]; total: number }> {
    const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        brand_id: brandId,
    });

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/items/search?${params}`,
        {
            headers: itemsSearchHeaders(),
            next: {
                revalidate: Number(process.env.REVALIDATE_TIME) || 3600,
                tags: ["brands", `brand-${brandId}-items`],
            },
        }
    );

    if (!res.ok) throw new Error(`Failed to fetch brand items: ${res.status}`);

    const json = (await res.json()) as ItemsSearchApiResponse;
    return mapItemsSearchResponse(json);
}

import { GetStoresResponse, StoreFilters } from "@/features/markets/types/stores.types";

function buildBackendParams(
    moduleId: string,
    filters: StoreFilters,
    limit: number,
    offset: number,
): URLSearchParams {
    const params = new URLSearchParams({
        limit: String(limit),
        offset: String(offset),
        module_id: moduleId,
    });

    if (filters.categoryId !== null) params.set("category_id", String(filters.categoryId));
    if (filters.hasOffer) params.set("has_offer", "1");
    if (filters.freeDelivery) params.set("free_delivery", "1");
    if (filters.topRated) params.set("top_rated", "1");
    if (filters.openNow) params.set("open_now", "1");
    if (filters.under30Min) params.set("under_30_min", "1");

    return params;
}

export async function getStores(
    moduleId: string,
    filters: StoreFilters,
    limit = 12,
    offset = 0,
): Promise<GetStoresResponse> {
    const backendParams = buildBackendParams(moduleId, filters, limit, offset);

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v2/stores?${backendParams}`,
        {
            method: "GET",
            headers: {
                Accept: "application/json",
                "X-Localization": "ar",
                moduleId,
                zoneId: process.env.ZONE_ID!,
                latitude: process.env.NEXT_PUBLIC_LATITUDE!,
                longitude: process.env.NEXT_PUBLIC_LONGITUDE!,
            },
            next: { revalidate: Number(process.env.REVALIDATE_TIME) },
        },
    );

    if (!res.ok) throw new Error(`Failed to fetch stores: ${res.status}`);

    return res.json();
}

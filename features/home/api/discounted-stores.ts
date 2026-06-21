import { DiscountedStore, GetDiscountedStoresResponse } from "@/features/home/types/discounted-stores.types";
import { ApiResponse, unwrap } from "@/shared/lib/api-response";

export async function getDiscountedStores(): Promise<DiscountedStore[]> {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v2/stores/discounted?limit=12&offset=0`,
        {
            headers: {
                Accept: "application/json",
                "X-Localization": "ar",
                zoneId: process.env.ZONE_ID!,
                moduleId: process.env.MODULE_ID!,
                latitude: process.env.NEXT_PUBLIC_LATITUDE!,
                longitude: process.env.NEXT_PUBLIC_LONGITUDE!,
            },
            next: {
                revalidate: 300,
                tags: ["discounted-stores", "home-data"],
            },
        }
    );

    if (!res.ok) throw new Error(`Failed to fetch stores: ${res.status}`);

    const data: GetDiscountedStoresResponse = await res.json();
    return data.stores ?? [];
}
import {
    GetHyperMarketOffersResponse,
    HyperMarketOffer,
} from "@/features/hyper-market/StoreDetails/types/offers.types";

export async function getHyperMarketOffers(moduleId: string): Promise<HyperMarketOffer[]> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/offers/active`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            zoneId: process.env.ZONE_ID!,
            moduleId,
        },
        next: {
            revalidate: Number(process.env.REVALIDATE_TIME) || 3600,
            tags: ["offers", "hyper-market-data"],
        },
    });

    if (!res.ok) throw new Error(`Failed to fetch offers: ${res.status}`);

    const data: GetHyperMarketOffersResponse = await res.json();
    return data.data ?? [];
}

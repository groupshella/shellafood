import type {
    GetHyperMarketOffersResponse,
    HyperMarketOffer,
} from "@/features/hyper-market/StoreDetails/types/offers.types";

export async function getHyperMarketOffers(moduleId: string, isArabic: boolean): Promise<HyperMarketOffer[]> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/offers/active`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "X-Localization": isArabic ? "ar" : "en",
            zoneId: process.env.ZONE_ID!,
            moduleId,
        },
        next: {
            revalidate: Number(process.env.REVALIDATE_TIME) || 3600,
            tags: ["offers", "hyper-market-data"],
        },
    });

    const json = (await res.json()) as GetHyperMarketOffersResponse;

    if (!res.ok || !json.success) {
        return [];
    }

    return json.data;
}

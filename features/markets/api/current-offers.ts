import {
    CurrentOffer,
    GetCurrentOffersResponse,
} from "@/features/markets/types/current-offers.types";

export async function getCurrentOffers(moduleId: string): Promise<CurrentOffer[]> {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v2/stores/offers?limit=10&offset=2`,
        {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                zoneId: process.env.ZONE_ID!,
                latitude: process.env.NEXT_PUBLIC_LATITUDE!,
                longitude: process.env.NEXT_PUBLIC_LONGITUDE!,
                moduleId,
            },
            next: { revalidate: Number(process.env.REVALIDATE_TIME) },
        },
    );

    if (!res.ok) throw new Error(`Failed to fetch current offers: ${res.status}`);

    const data: GetCurrentOffersResponse = await res.json();
    return data.offers ?? [];
}

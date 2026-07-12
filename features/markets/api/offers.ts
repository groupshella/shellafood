import { GetOffersResponse, Offer } from "@/features/markets/types/offers.types";

export async function getOffers(moduleId: string, isArabic: boolean = false): Promise<Offer[]> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/offers/active`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            zoneId: process.env.ZONE_ID!,
            moduleId,
            "X-localization": isArabic ? "ar" : "en",
            "Accept-Language": isArabic ? "ar" : "en",
        },
        next: { revalidate: Number(process.env.REVALIDATE_TIME) },
    });

    if (!res.ok) throw new Error(`Failed to fetch offers: ${res.status}`);

    const data: GetOffersResponse = await res.json();
    return data.data ?? [];
}

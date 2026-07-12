import type { GetOffersResponse, Offer } from "@/features/offers/types/offer.types";
import { offerFetchHeaders } from "@/features/offers/lib/offer-fetch-headers";

export async function getOffers(moduleId = "3", isArabic: boolean): Promise<Offer[]> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/offers/active`, {
        headers: offerFetchHeaders(moduleId, isArabic ? "ar" : "en"),
        next: {
            revalidate: 0,
            tags: ["offers"],
        },
    });

    const json = (await res.json()) as GetOffersResponse;

    if (!res.ok || !json.success) {
        const message = !json.success ? json.message : `Failed to fetch offers: ${res.status}`;
        throw new Error(isArabic ? "فشل تحميل العروض" : "Failed to fetch offers");
    }

    return json.data;
}

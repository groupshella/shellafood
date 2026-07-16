import type { GetOffersResponse, Offer } from "@/features/offers/types/offer.types";
import { offerFetchHeaders } from "@/features/offers/lib/offer-fetch-headers";

export async function getOffers(
    moduleId = "3",
    lang: "ar" | "en" = "ar"
): Promise<Offer[]> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/offers/active`, {
        headers: offerFetchHeaders(moduleId, lang),
        next: {
            revalidate: 0,
            tags: ["offers", `offers-${lang}`],
        },
    });

    const json = (await res.json()) as GetOffersResponse;

    if (!res.ok || !json.success) {
        const message = !json.success ? json.message : `Failed to fetch offers: ${res.status}`;
        throw new Error(message);
    }

    return json.data;
}

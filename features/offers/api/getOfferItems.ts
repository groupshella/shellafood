import { mapNewItemsResponse } from "@/features/offers/lib/normalize-offer-item";
import { offerFetchHeaders } from "@/features/offers/lib/offer-fetch-headers";
import type {
    GetOfferNewItemsApiResponse,
    OfferItemsResult,
} from "@/features/offers/types/offer.types";

export async function getOfferItems(
    offerId: string,
    offset = 1,
    limit = 50,
    moduleId = "3",
    noStore = false
): Promise<OfferItemsResult> {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/offers/${offerId}/newitems?offset=${offset}&limit=${limit}`,
        {
            headers: offerFetchHeaders(moduleId),
            ...(noStore
                ? { cache: "no-store" as const }
                : {
                      next: {
                          revalidate: Number(process.env.REVALIDATE_TIME) || 3600,
                          tags: ["offers", `offer-${offerId}-items`],
                      },
                  }),
        }
    );

    if (!res.ok) throw new Error(`Failed to fetch offer items: ${res.status}`);

    const json = (await res.json()) as GetOfferNewItemsApiResponse;
    return mapNewItemsResponse(json);
}

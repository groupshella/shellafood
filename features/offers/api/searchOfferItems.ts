import { getServerLocale } from "@/features/language/getServerLocale";
import { mapSearchItemsResponse } from "@/features/offers/lib/normalize-offer-item";

import { offerFetchHeaders } from "@/features/offers/lib/offer-fetch-headers";

import type {

    GetOfferSearchApiResponse,

    OfferItemsResult,

} from "@/features/offers/types/offer.types";



export async function searchOfferItems(

    offerId: string,

    query: string,

    offset = 1,

    limit = 50,

    moduleId = "3"

): Promise<OfferItemsResult> {

    const locale = await getServerLocale();
    const isArabic = locale === "ar";
    const res = await fetch(

        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/offers/${offerId}/search?query=${encodeURIComponent(query)}&offset=${offset}&limit=${limit}`,

        {

            headers: offerFetchHeaders(moduleId, isArabic ? "ar" : "en"),

            cache: "no-store",

        }

    );



    if (!res.ok) throw new Error(`Failed to search offer items: ${res.status}`);



    const json = (await res.json()) as GetOfferSearchApiResponse;



    if (!json.success) {

        throw new Error(isArabic ? "فشل البحث عن العروض" : "Offer search failed");

    }



    return mapSearchItemsResponse(json);

}



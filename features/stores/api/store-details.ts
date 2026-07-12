import { getServerLocale } from "@/features/language/getServerLocale";
import { StoreDetails } from "@/features/stores/types/store.types";

export async function getStoreDetails(storeId: string): Promise<StoreDetails> {
    const locale = await getServerLocale();
    const isArabic = locale === "ar";
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v2/stores/${storeId}`, {
        headers: {
            Accept: "application/json",
            "Accept-Language": isArabic ? "ar" : "en",
            "X-Localization": isArabic ? "ar" : "en",
            zoneId: process.env.ZONE_ID!,
        },
        next: {
            revalidate: Number(process.env.REVALIDATE_TIME) || 3600,
            tags: ["stores", `store-${storeId}`],
        },
    });

    if (!res.ok) throw new Error(`Failed to fetch store details: ${res.status}`);

    return res.json() as Promise<StoreDetails>;
}

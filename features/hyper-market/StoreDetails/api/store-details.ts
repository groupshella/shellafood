import { StoreDetails } from "@/features/hyper-market/StoreDetails/types/store-details.types";

export async function getStoreDetails(storeId: string): Promise<StoreDetails> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v2/stores/${storeId}`, {
        headers: {
            Accept: "application/json",
            "Accept-Language": "ar",
            "X-Localization": "ar",
            zoneId: process.env.ZONE_ID!,
        },
        next: {
            revalidate: Number(process.env.REVALIDATE_TIME) || 3600,
            tags: ["hyper-market", `store-${storeId}`],
        },
    });

    if (!res.ok) throw new Error(`Failed to fetch store details: ${res.status}`);

    return res.json() as Promise<StoreDetails>;
}

import { RelatedItem } from "@/features/item/types/related-items.types";

export async function getRelatedItems(itemId: string, isArabic: boolean): Promise<RelatedItem[]> {

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v2/items/related-items/${itemId}`, {
        headers: {
            Accept: "application/json",
            "Accept-Language": isArabic ? "ar" : "en",
            "X-Localization": isArabic ? "ar" : "en",
            zoneId: process.env.ZONE_ID!,
        },
        next: {
            revalidate: Number(process.env.REVALIDATE_TIME) || 3600,
            tags: ["item", `item-${itemId}-related`],
        },
    });

    if (!res.ok) throw new Error(`Failed to fetch related items: ${res.status}`);

    return res.json() as Promise<RelatedItem[]>;
}

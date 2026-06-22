import { cache } from "react";
import { ItemDetails } from "@/features/item/types/item.types";


export const getItemDetails = cache(async (itemId: string): Promise<ItemDetails> => {

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v2/items/details/${itemId}`, {
        headers: {
            Accept: "application/json",
            "Accept-Language": "ar",
            "X-Localization": "ar",
            zoneId: process.env.ZONE_ID!,
        },
        next: {
            revalidate: Number(process.env.REVALIDATE_TIME) || 3600,
            tags: ["item", `item-${itemId}`],
        },
    });

    if (!res.ok) throw new Error(`Failed to fetch item details: ${res.status}`);

    return res.json() as Promise<ItemDetails>;
});

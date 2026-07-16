import { cache } from "react";
import { ItemDetails } from "@/features/item/types/item.types";

export const getItemDetails = cache(
    async (itemId: string, lang: "ar" | "en"): Promise<ItemDetails> => {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/v2/items/details/${itemId}`,
            {
                headers: {
                    Accept: "application/json",
                    "Accept-Language": lang,
                    "X-Localization": lang,
                    lang,
                    zoneId: process.env.ZONE_ID!,
                },
                next: {
                    revalidate: Number(process.env.REVALIDATE_TIME) || 3600,
                    tags: ["item", `item-${itemId}`, `item-${itemId}-${lang}`],
                },
            }
        );

        if (!res.ok) throw new Error(`Failed to fetch item details: ${res.status}`);

        return res.json() as Promise<ItemDetails>;
    }
);

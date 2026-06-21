import { cache } from "react";
import { ItemDetails } from "@/features/item/types/item.types";

function resolveModuleId(moduleId?: string): string {
    return moduleId ?? process.env.MODULE_ID!;
}

export const getItemDetails = cache(async (itemId: string, moduleId?: string): Promise<ItemDetails> => {
    const resolvedModuleId = resolveModuleId(moduleId);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/items/details/${itemId}`, {
        headers: {
            Accept: "application/json",
            "Accept-Language": "ar",
            "X-Localization": "ar",
            zoneId: process.env.ZONE_ID!,
            moduleId: resolvedModuleId,
        },
        next: {
            revalidate: Number(process.env.REVALIDATE_TIME) || 3600,
            tags: ["item", `item-${itemId}`],
        },
    });

    if (!res.ok) throw new Error(`Failed to fetch item details: ${res.status}`);

    return res.json() as Promise<ItemDetails>;
});

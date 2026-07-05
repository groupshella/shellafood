"use server";

import { cookies } from "next/headers";
import { updateTag } from "next/cache";
import { COOKIE_KEYS } from "@/features/auth/types/auth.types";

async function buildHeaders(): Promise<Record<string, string>> {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_KEYS.ACCESS_TOKEN)?.value;

    const headers: Record<string, string> = {
        "Content-Type": "application/json; charset=UTF-8",
        "X-localization": "ar",
        zoneId: process.env.ZONE_ID!,
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    return headers;
}

export async function addToWishlist({
    itemId,
    storeId,
}: {
    itemId?: number;
    storeId?: number;
}): Promise<{ success: boolean; message: string }> {
    const headers = await buildHeaders();
    const params = itemId != null ? `item_id=${itemId}` : `store_id=${storeId}`;

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/customer/wish-list/add?${params}`,
        {
            method: "POST",
            headers,
            body: null,
        }
    );

    if (!res.ok) {
        return { success: false, message: "فشل في الإضافة إلى المفضلة" };
    }

    updateTag("wishlist");
    const json = await res.json();
    return { success: true, message: json.message ?? "تمت الإضافة إلى المفضلة" };
}

export async function removeFromWishlist({
    itemId,
    storeId,
}: {
    itemId?: number;
    storeId?: number;
}): Promise<{ success: boolean; message: string }> {
    const headers = await buildHeaders();
    const params = itemId != null ? `item_id=${itemId}` : `store_id=${storeId}`;

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/customer/wish-list/remove?${params}`,
        {
            method: "DELETE",
            headers,
        }
    );

    if (!res.ok) {
        return { success: false, message: "فشل في إزالة المفضلة" };
    }

    updateTag("wishlist");
    const json = await res.json();
    return { success: true, message: json.message ?? "تمت الإزالة من المفضلة" };
}

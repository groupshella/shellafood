"use server";

import { revalidatePath, updateTag } from "next/cache";
import {
    buildWishlistHeaders,
    getFavoritesApiUrl,
} from "@/features/favorites/lib/wishlist-request";

function invalidateWishlistCache() {
    updateTag("wishlist");
    updateTag("favorite-orders");
    revalidatePath("/favorites");
}

export async function addToWishlist({
    itemId,
    storeId,
}: {
    itemId?: number;
    storeId?: number;
}): Promise<{ success: boolean; message: string }> {
    if (itemId == null && storeId == null) {
        return { success: false, message: "معرّف العنصر غير صالح" };
    }

    const { headers, token } = await buildWishlistHeaders({ withModuleId: true });
    if (!token) {
        return { success: false, message: "يجب تسجيل الدخول لإضافة المفضلة" };
    }

    const params = itemId != null ? `item_id=${itemId}` : `store_id=${storeId}`;

    const res = await fetch(
        getFavoritesApiUrl(`/api/v1/customer/wish-list/add?${params}`),
        {
            method: "POST",
            headers,
            body: null,
        }
    );

    if (!res.ok) {
        return { success: false, message: "فشل في الإضافة إلى المفضلة" };
    }

    invalidateWishlistCache();

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
    if (itemId == null && storeId == null) {
        return { success: false, message: "معرّف العنصر غير صالح" };
    }

    const { headers, token } = await buildWishlistHeaders({ withModuleId: true });
    if (!token) {
        return { success: false, message: "يجب تسجيل الدخول لإدارة المفضلة" };
    }

    const params = itemId != null ? `item_id=${itemId}` : `store_id=${storeId}`;

    const res = await fetch(
        getFavoritesApiUrl(`/api/v1/customer/wish-list/remove?${params}`),
        {
            method: "DELETE",
            headers,
        }
    );

    if (!res.ok) {
        return { success: false, message: "فشل في إزالة المفضلة" };
    }

    invalidateWishlistCache();

    const json = await res.json();
    return { success: true, message: json.message ?? "تمت الإزالة من المفضلة" };
}

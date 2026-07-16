"use server";

import { revalidatePath, updateTag } from "next/cache";
import {
    buildWishlistHeaders,
    getFavoritesApiUrl,
} from "@/features/favorites/lib/wishlist-request";
import { getLocale } from "@/shared/lib/locale";

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
    const lang = await getLocale();
    const isArabic = lang === "ar";

    if (itemId == null && storeId == null) {
        return {
            success: false,
            message: isArabic ? "معرّف العنصر غير صالح" : "Invalid item id",
        };
    }

    const { headers, token } = await buildWishlistHeaders({
        withModuleId: true,
        lang,
    });
    if (!token) {
        return {
            success: false,
            message: isArabic
                ? "يجب تسجيل الدخول لإضافة المفضلة"
                : "Sign in to add favorites",
        };
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
        return {
            success: false,
            message: isArabic
                ? "فشل في الإضافة إلى المفضلة"
                : "Failed to add to favorites",
        };
    }

    invalidateWishlistCache();

    const json = await res.json();
    return {
        success: true,
        message:
            json.message ??
            (isArabic ? "تمت الإضافة إلى المفضلة" : "Added to favorites"),
    };
}

export async function removeFromWishlist({
    itemId,
    storeId,
}: {
    itemId?: number;
    storeId?: number;
}): Promise<{ success: boolean; message: string }> {
    const lang = await getLocale();
    const isArabic = lang === "ar";

    if (itemId == null && storeId == null) {
        return {
            success: false,
            message: isArabic ? "معرّف العنصر غير صالح" : "Invalid item id",
        };
    }

    const { headers, token } = await buildWishlistHeaders({
        withModuleId: true,
        lang,
    });
    if (!token) {
        return {
            success: false,
            message: isArabic
                ? "يجب تسجيل الدخول لإدارة المفضلة"
                : "Sign in to manage favorites",
        };
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
        return {
            success: false,
            message: isArabic
                ? "فشل في إزالة المفضلة"
                : "Failed to remove from favorites",
        };
    }

    invalidateWishlistCache();

    const json = await res.json();
    return {
        success: true,
        message:
            json.message ??
            (isArabic ? "تمت الإزالة من المفضلة" : "Removed from favorites"),
    };
}

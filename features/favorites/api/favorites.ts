import { cookies } from "next/headers";
import { COOKIE_KEYS } from "@/features/auth/types/auth.types";
import type {
    WishlistResponse,
    OrderListResponse,
} from "@/features/favorites/types/favorites.types";

async function buildHeaders({ isArabic }: { isArabic: boolean }): Promise<Record<string, string>> {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_KEYS.ACCESS_TOKEN)?.value;

    const headers: Record<string, string> = {
        "Content-Type": "application/json; charset=UTF-8",
        "X-localization": isArabic ? "ar" : "en",
        zoneId: process.env.ZONE_ID!,
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    return headers;
}

export async function getWishlist({ isArabic }: { isArabic: boolean }): Promise<WishlistResponse> {
    const headers = await buildHeaders({ isArabic });

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/customer/wish-list`,
        {
            headers,
            cache: "no-store",
        }
    );

    if (!res.ok) throw new Error(`Failed to fetch wishlist: ${res.status}`);
    return res.json();
}

export async function getFavoriteOrders(
    offset = 1,
    limit = 20,
    isArabic: boolean
): Promise<OrderListResponse> {
    const headers = await buildHeaders({ isArabic });

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/customer/order/list?offset=${offset}&limit=${limit}`,
        {
            headers,
            cache: "no-store",
        }
    );

    if (!res.ok) throw new Error(`Failed to fetch orders: ${res.status}`);
    return res.json();
}

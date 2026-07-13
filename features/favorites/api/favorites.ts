import { cache } from "react";
import type {
    FavoriteOrder,
    FavoriteProduct,
    FavoriteStore,
    OrderListApiResponse,
} from "@/features/favorites/types/favorites.types";
import {
    mapFavoriteOrdersResponse,
    mapWishlistResponse,
} from "@/features/favorites/lib/normalize-favorites";
import {
    buildWishlistHeaders,
    getFavoritesApiUrl,
} from "@/features/favorites/lib/wishlist-request";

const fetchWishlistJson = cache(async (): Promise<unknown> => {
    // No moduleId — wishlist spans all modules; scoping to MODULE_ID returns
    // other-module stores as `{ store: null, unavailable: true }`.
    const { headers, token } = await buildWishlistHeaders();

    if (!token) return { item: [], store: [] };

    const res = await fetch(getFavoritesApiUrl("/api/v1/customer/wish-list"), {
        headers,
        cache: "no-store",
        next: { tags: ["wishlist"] },
    });

    if (!res.ok) throw new Error(`Failed to fetch wishlist: ${res.status}`);
    return res.json();
});

async function fetchOrderListJson(
    offset: number,
    limit: number
): Promise<OrderListApiResponse> {
    const { headers, token } = await buildWishlistHeaders();

    if (!token) {
        return { total_size: 0, limit: String(limit), offset, orders: [] };
    }

    const res = await fetch(
        getFavoritesApiUrl(
            `/api/v1/customer/order/list?offset=${offset}&limit=${limit}`
        ),
        {
            headers,
            cache: "no-store",
            next: { tags: ["favorite-orders"] },
        }
    );

    if (!res.ok) throw new Error(`Failed to fetch orders: ${res.status}`);
    return res.json();
}

export async function getFavoriteProducts(): Promise<FavoriteProduct[]> {
    const json = await fetchWishlistJson();
    return mapWishlistResponse(json).products;
}

export async function getFavoriteStores(): Promise<FavoriteStore[]> {
    const json = await fetchWishlistJson();
    return mapWishlistResponse(json).stores;
}

export async function getFavoriteOrders(
    offset = 1,
    limit = 20
): Promise<FavoriteOrder[]> {
    const json = await fetchOrderListJson(offset, limit);
    return mapFavoriteOrdersResponse(json);
}

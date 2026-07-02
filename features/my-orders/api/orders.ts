import { cookies } from "next/headers";
import { COOKIE_KEYS } from "@/features/auth/types/auth.types";
import type { ApiOrder, OrderListApiResponse } from "@/features/my-orders/types/orders.types";

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

export async function getOrderList(
    offset = 1,
    limit = 20
): Promise<OrderListApiResponse> {
    const headers = await buildHeaders();

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/customer/order/list?offset=${offset}&limit=${limit}`,
        { headers, cache: "no-store" }
    );

    if (!res.ok) throw new Error(`Failed to fetch order list: ${res.status}`);
    return res.json();
}

export async function getRunningOrders(
    offset = 1,
    limit = 10
): Promise<OrderListApiResponse> {
    const headers = await buildHeaders();

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/customer/order/running-orders?offset=${offset}&limit=${limit}`,
        { headers, cache: "no-store" }
    );

    if (!res.ok) throw new Error(`Failed to fetch running orders: ${res.status}`);
    return res.json();
}

/** Merges running + past orders, deduplicating by id. Running orders come first. */
export async function getAllOrders(): Promise<ApiOrder[]> {
    const [runningRes, listRes] = await Promise.allSettled([
        getRunningOrders(),
        getOrderList(),
    ]);

    const running: ApiOrder[] =
        runningRes.status === "fulfilled" ? runningRes.value.orders ?? [] : [];

    const list: ApiOrder[] =
        listRes.status === "fulfilled" ? listRes.value.orders ?? [] : [];

    const seen = new Set<number>();
    const merged: ApiOrder[] = [];

    for (const o of [...running, ...list]) {
        if (!seen.has(o.id)) {
            seen.add(o.id);
            merged.push(o);
        }
    }

    return merged;
}

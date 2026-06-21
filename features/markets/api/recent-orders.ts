import { cookies } from "next/headers";
import { COOKIE_KEYS } from "@/features/auth/types/auth.types";
import {
    GetRecentOrdersResponse,
    RecentOrder,
} from "@/features/markets/types/recent-orders.types";

export async function getRecentOrders(moduleId: string): Promise<RecentOrder[]> {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_KEYS.ACCESS_TOKEN)?.value;

    if (!token) return [];

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/customer/order/recent`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            moduleId,
        },
        next: { revalidate: Number(process.env.REVALIDATE_TIME) },
    });

    if (!res.ok) {
        if (res.status === 401) return [];
        throw new Error(`Failed to fetch recent orders: ${res.status}`);
    }

    const data: GetRecentOrdersResponse = await res.json();
    return data.orders ?? [];
}

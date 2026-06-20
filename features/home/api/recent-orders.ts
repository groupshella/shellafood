import { cookies } from "next/headers";
import { COOKIE_KEYS } from "@/features/auth/types/auth.types";
import { GetRecentOrdersResponse, RecentOrder } from "@/features/home/types/recent-orders.types";
import { ApiResponse, unwrap } from "@/shared/lib/api-response";

export async function getRecentOrders(): Promise<RecentOrder[]> {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_KEYS.ACCESS_TOKEN)?.value;

    if (!token) return [];

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/customer/order/recent`,
        {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            next: {
                revalidate: 60,
                tags: ["recent-orders"],
            },
        }
    );

    if (!res.ok) {
        if (res.status === 401) return [];
        throw new Error(`Failed to fetch orders: ${res.status}`);
    }

    const data: GetRecentOrdersResponse = await res.json();
    return data.orders ?? [];
}
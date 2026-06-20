import { cookies } from "next/headers";
import { COOKIE_KEYS } from "@/features/auth/types/auth.types";
import { GetNotificationsResponse, Notification } from "@/features/notifications/types/notifications.types";

const DEMO_BACKEND_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://shellafood.com";

export async function getNotifications(): Promise<Notification[]> {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_KEYS.ACCESS_TOKEN)?.value;

    if (!token) return [];

    const res = await fetch(
        `${DEMO_BACKEND_URL}/api/v1/customer/notifications?limit=20&offset=0`,
        {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                "X-Localization": "ar",
            },
            next: {
                revalidate: 60,
                tags: ["notifications"],
            },
        }
    );

    if (!res.ok) {
        if (res.status === 401) return [];
        throw new Error(`Failed to fetch notifications: ${res.status}`);
    }

    const body: GetNotificationsResponse | Notification[] = await res.json();

    if (Array.isArray(body)) return body;

    return body.notifications ?? [];
}

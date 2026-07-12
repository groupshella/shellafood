import { cookies } from "next/headers";
import { COOKIE_KEYS } from "@/features/auth/types/auth.types";
import {
    GetNotificationsResponse,
    Notification,
    NotificationApiItem,
} from "@/features/notifications/types/notifications.types";

const DEMO_BACKEND_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://shellafood.com";

function normalizeNotification(raw: NotificationApiItem): Notification {
    const image = raw.data?.image?.trim() || null;

    return {
        id: raw.id,
        title: raw.data?.title ?? "",
        description: raw.data?.description ?? "",
        image,
        image_full_url: image,
        status: raw.status,
        created_at: raw.created_at,
    };
}

function normalizeNotifications(body: unknown): Notification[] {
    if (!body) return [];

    if (Array.isArray(body)) {
        if (body.length === 0) return [];

        const first = body[0];
        if (first && typeof first === "object" && "data" in first) {
            return (body as NotificationApiItem[]).map(normalizeNotification);
        }

        return body as Notification[];
    }

    if (typeof body === "object" && body !== null && "notifications" in body) {
        const wrapped = body as GetNotificationsResponse;
        return (wrapped.notifications ?? []).map(normalizeNotification);
    }

    return [];
}

export async function getNotifications(isArabic: boolean): Promise<Notification[]> {
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
                "X-Localization": isArabic ? "ar" : "en",
            },
            next: {
                revalidate: 60,
                tags: ["notifications"],
            },
        }
    );

    if (!res.ok) {
        if (res.status === 401) return [];
        throw new Error(isArabic ? "فشل تحميل الإشعارات" : `Failed to fetch notifications: ${res.status}`);
    }

    const body: unknown = await res.json();
    return normalizeNotifications(body);
}

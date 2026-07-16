import { cookies } from "next/headers";
import { COOKIE_KEYS } from "@/features/auth/types/auth.types";
import type { ApiOrderDetailItem, OrderTrack } from "@/features/my-orders/types/orders.types";

async function buildHeaders(lang: "ar" | "en"): Promise<Record<string, string>> {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_KEYS.ACCESS_TOKEN)?.value;

    const headers: Record<string, string> = {
        "Content-Type": "application/json; charset=UTF-8",
        "Accept-Language": lang,
        "X-localization": lang,
        lang,
        zoneId: process.env.ZONE_ID!,
        moduleId: process.env.MODULE_ID ?? "3",
    };

    if (process.env.NEXT_PUBLIC_LATITUDE && process.env.NEXT_PUBLIC_LONGITUDE) {
        headers.latitude = process.env.NEXT_PUBLIC_LATITUDE;
        headers.longitude = process.env.NEXT_PUBLIC_LONGITUDE;
    }

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    return headers;
}

export async function getOrderTrack(
    orderId: string,
    lang: "ar" | "en"
): Promise<OrderTrack | null> {
    const headers = await buildHeaders(lang);

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/customer/order/track?order_id=${orderId}`,
        { headers, cache: "no-store" }
    );

    if (!res.ok) return null;

    const json = await res.json();
    return (json?.order ?? json) as OrderTrack;
}

export async function getOrderDetails(
    orderId: string,
    lang: "ar" | "en"
): Promise<ApiOrderDetailItem[]> {
    const headers = await buildHeaders(lang);

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/customer/order/details?order_id=${orderId}`,
        { headers, cache: "no-store" }
    );

    if (!res.ok) return [];

    const json = await res.json();
    if (Array.isArray(json)) return json;
    return json?.details ?? json?.order_details ?? [];
}

export async function getOrderDetailData(orderId: string, lang: "ar" | "en") {
    const [track, details] = await Promise.all([
        getOrderTrack(orderId, lang),
        getOrderDetails(orderId, lang),
    ]);

    if (!track) return null;

    return { track, details };
}

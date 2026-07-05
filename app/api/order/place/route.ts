import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { apiSuccess, apiError } from "@/shared/lib/api-response";
import { COOKIE_KEYS } from "@/features/auth/types/auth.types";
import type { PlaceOrderPayload } from "@/features/checkout/types/checkout.types";

export interface PlaceOrderResponse {
    order_id: number;
}

/**
 * BFF proxy for POST /api/v1/customer/order/place.
 * Injects auth token from the httpOnly cookie so the client never handles it.
 * Accepts and forwards the PlaceOrderPayload — never touches payment card data.
 */
export async function POST(request: NextRequest) {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get(COOKIE_KEYS.ACCESS_TOKEN)?.value;

    if (!accessToken) {
        return apiError("Unauthorized", 401);
    }

    let body: PlaceOrderPayload;
    try {
        body = await request.json();
    } catch {
        return apiError("Invalid request body", 400);
    }

    if (!body.cart?.length || !body.order_amount || !body.store_id) {
        return apiError("Missing required order fields", 400);
    }

    try {
        const backendRes = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/v1/customer/order/place`,
            {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                    zoneId: process.env.ZONE_ID ?? "[2]",
                    moduleId: process.env.MODULE_ID ?? "3",
                    "X-localization": "ar",
                },
                body: JSON.stringify(body),
                cache: "no-store",
            }
        );

        const data = await backendRes.json();

        if (!backendRes.ok) {
            return apiError(data?.message ?? "Failed to place order", backendRes.status);
        }

        const orderId = data?.order_id ?? data?.data?.order_id;
        if (!orderId) {
            return apiError("Order placed but no order_id returned", 502);
        }

        return apiSuccess<PlaceOrderResponse>({ order_id: orderId });
    } catch {
        return apiError("Order placement request failed", 502);
    }
}

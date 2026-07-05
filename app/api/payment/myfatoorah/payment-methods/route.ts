import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { apiSuccess, apiError, extractBackendError } from "@/shared/lib/api-response";
import { COOKIE_KEYS } from "@/features/auth/types/auth.types";

/**
 * BFF proxy for GET /api/v1/payment/myfatoorah/payment-methods-with-ids.
 * Injects auth + zone/module headers from environment — never exposed to client JS.
 *
 * Query params forwarded:
 *   amount   (required) — order total, used by backend to compute per-method fees
 *   currency (optional, defaults to SAR)
 */
export async function GET(request: NextRequest) {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get(COOKIE_KEYS.ACCESS_TOKEN)?.value;

    if (!accessToken) {
        return apiError("Unauthorized", 401);
    }

    const { searchParams } = request.nextUrl;
    const amount = searchParams.get("amount");
    const currency = searchParams.get("currency") ?? "SAR";

    if (!amount) {
        return apiError("Missing required parameter: amount", 400);
    }

    const backendUrl = new URL(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/payment/myfatoorah/payment-methods-with-ids`
    );
    backendUrl.searchParams.set("amount", amount);
    backendUrl.searchParams.set("currency", currency);

    try {
        const backendRes = await fetch(backendUrl.toString(), {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
                "X-localization": "ar",
                zoneId: process.env.ZONE_ID ?? "[2]",
                moduleId: process.env.MODULE_ID ?? "3",
            },
            cache: "no-store",
        });

        const data = await backendRes.json();

        if (!backendRes.ok || !data?.success) {
            return apiError(extractBackendError(data, "Failed to fetch payment methods"), backendRes.status);
        }

        return apiSuccess(data.data);
    } catch {
        return apiError("Payment methods request failed", 502);
    }
}

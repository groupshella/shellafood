import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { apiSuccess, apiError, extractBackendError } from "@/shared/lib/api-response";
import { COOKIE_KEYS } from "@/features/auth/types/auth.types";
import type { CheckStatusRequest, CheckStatusData } from "@/features/payment/types/payment.types";

/**
 * BFF proxy for POST /api/v1/payment/myfatoorah/check-status.
 *
 * Called once after the user returns from the hosted payment page.
 * Do NOT poll — call once and classify the result with classifyPaymentResult().
 *
 * Returns a unified CheckStatusData shape that includes:
 *   InvoiceStatus — gateway-level status (Paid | Pending | InProgress | Failed …)
 *   order         — backend order record (payment_status, order_status)
 */
export async function POST(request: NextRequest) {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get(COOKIE_KEYS.ACCESS_TOKEN)?.value;

    if (!accessToken) {
        return apiError("Unauthorized", 401);
    }

    let body: CheckStatusRequest;
    try {
        body = await request.json();
    } catch {
        return apiError("Invalid request body", 400);
    }

    if (!body.key_type || !body.key) {
        return apiError("Missing key_type or key", 400);
    }

    try {
        const backendRes = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/v1/payment/myfatoorah/check-status`,
            {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json; charset=UTF-8",
                    Authorization: `Bearer ${accessToken}`,
                    "X-localization": "ar",
                    zoneId: process.env.ZONE_ID ?? "[2]",
                    moduleId: process.env.MODULE_ID ?? "3",
                },
                body: JSON.stringify({
                    key_type: body.key_type,
                    key: body.key,
                }),
                cache: "no-store",
            }
        );

        const json = await backendRes.json();

        if (!backendRes.ok || !json?.success) {
            return apiError(extractBackendError(json, "Failed to check payment status"), backendRes.status);
        }

        return apiSuccess<CheckStatusData>({
            InvoiceStatus: json.data?.InvoiceStatus,
            order: json.order,
        });
    } catch {
        return apiError("Payment status check failed", 502);
    }
}

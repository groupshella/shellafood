// app/api/payment/myfatoorah/session/route.ts
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { apiSuccess, apiError } from "@/shared/lib/api-response";
import { COOKIE_KEYS } from "@/features/auth/types/auth.types";
import type { CreateSessionRequest } from "@/features/payment/types/payment.types";

/**
 * This route is a proxy only.
 * - It reads the user's auth token from the httpOnly cookie (never exposed to client JS).
 * - It forwards the request to the real Shella backend.
 * - It NEVER accepts or forwards card_number / expiry / cvv — the request body
 *   coming from the client only ever contains order/amount/flags.
 */
export async function POST(request: NextRequest) {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get(COOKIE_KEYS.ACCESS_TOKEN)?.value;

    if (!accessToken) {
        return apiError("Unauthorized", 401);
    }

    let body: CreateSessionRequest;
    try {
        body = await request.json();
    } catch {
        return apiError("Invalid request body", 400);
    }

    if (!body.order_id || !body.amount || !body.currency) {
        return apiError("Missing required payment fields", 400);
    }

    try {
        const backendRes = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/v2/payments/myfatoorah/session`,
            {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                    "X-localization": body.language === "EN" ? "en" : "ar",
                },
                body: JSON.stringify({
                    order_id: body.order_id,
                    amount: body.amount,
                    currency: body.currency,
                    language: body.language,
                    save_card: body.save_card,
                    retrieve_saved_tokens: body.retrieve_saved_tokens,
                    supported_payment_methods: body.supported_payment_methods,
                }),
                cache: "no-store",
            }
        );

        const data = await backendRes.json();

        if (!backendRes.ok || !data?.success) {
            return apiError(data?.message ?? "Failed to create payment session", backendRes.status);
        }

        return apiSuccess(data.data);
    } catch (error) {
        // Never log request/response bodies here — keep this generic.
        return apiError("Payment session request failed", 502);
    }
}

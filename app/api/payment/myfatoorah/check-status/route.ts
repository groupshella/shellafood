// app/api/payment/myfatoorah/check-status/route.ts
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { apiSuccess, apiError } from "@/shared/lib/api-response";
import { COOKIE_KEYS } from "@/features/auth/types/auth.types";
import type { CheckStatusRequest } from "@/features/payment/types/payment.types";

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
            `${process.env.NEXT_PUBLIC_API_URL}/api/v2/payments/myfatoorah/check-status`,
            {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    key_type: body.key_type,
                    key: body.key,
                }),
                cache: "no-store",
            }
        );

        const data = await backendRes.json();

        if (!backendRes.ok || !data?.success) {
            return apiError(data?.message ?? "Failed to check payment status", backendRes.status);
        }

        return apiSuccess(data.data);
    } catch (error) {
        return apiError("Payment status check failed", 502);
    }
}

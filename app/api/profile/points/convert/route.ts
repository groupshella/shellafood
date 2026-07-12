import { cookies } from "next/headers";

import { COOKIE_KEYS } from "@/features/auth/types/auth.types";
import { apiError, apiSuccess, extractBackendError } from "@/shared/lib/api-response";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;
const MODULE_ID = process.env.MODULE_ID ?? "3";
const ZONE_ID = process.env.ZONE_ID ?? "[2]";

function authHeaders(token: string): HeadersInit {
    return {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "X-localization": "ar",
        moduleId: MODULE_ID,
        zoneId: ZONE_ID,
    };
}

/**
 * Two-step conversion: first requestExchangeWalletMoney, then ExchangeWalletMoney.
 * Both are POST to the backend.
 * The client sends { points } and this route handles both steps atomically.
 */
export async function POST(req: Request) {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_KEYS.ACCESS_TOKEN)?.value;
    if (!token) return apiError("Unauthorized", 401);

    let body: { points?: number };
    try {
        body = await req.json();
    } catch {
        return apiError("Invalid request body", 400);
    }

    if (!body.points || body.points <= 0) {
        return apiError("يجب تحديد عدد النقاط المراد تحويلها", 400);
    }

    try {
        // Step 1 — request exchange
        const requestRes = await fetch(
            `${BACKEND_URL}/api/v1/customer/requestExchangeWalletMoney`,
            {
                method: "POST",
                headers: authHeaders(token),
                body: JSON.stringify({ points: body.points }),
            },
        );

        const requestJson = await requestRes.json();
        if (!requestRes.ok) {
            return apiError(
                extractBackendError(requestJson, "فشل في طلب تحويل النقاط"),
                requestRes.status,
            );
        }

        // Step 2 — execute exchange
        const executeRes = await fetch(
            `${BACKEND_URL}/api/v1/customer/ExchangeWalletMoney`,
            {
                method: "POST",
                headers: authHeaders(token),
                body: JSON.stringify({ points: body.points }),
            },
        );

        const executeJson = await executeRes.json();
        if (!executeRes.ok) {
            return apiError(
                extractBackendError(executeJson, "فشل في تنفيذ تحويل النقاط"),
                executeRes.status,
            );
        }

        return apiSuccess(executeJson?.data ?? executeJson);
    } catch {
        return apiError("فشل في تحويل النقاط إلى المحفظة", 502);
    }
}

import { cookies } from "next/headers";

import { COOKIE_KEYS } from "@/features/auth/types/auth.types";
import { apiError, apiSuccess, extractBackendError } from "@/shared/lib/api-response";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;
const MODULE_ID = process.env.MODULE_ID ?? "3";
const ZONE_ID = process.env.ZONE_ID ?? "[2]";

function authHeaders(token: string): HeadersInit {
    return {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json; charset=UTF-8",
        "X-localization": "ar",
        moduleId: MODULE_ID,
        zoneId: ZONE_ID,
    };
}

/**
 * POST /api/v1/customer/loyalty-point/point-transfer
 * Body: { point: number }
 */
export async function POST(req: Request) {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_KEYS.ACCESS_TOKEN)?.value;
    if (!token) return apiError("Unauthorized", 401);
    if (!BACKEND_URL) return apiError("API URL not configured", 500);

    let body: { point?: number; points?: number };
    try {
        body = await req.json();
    } catch {
        return apiError("Invalid request body", 400);
    }

    const point = Number(body.point ?? body.points ?? 0);
    if (!Number.isFinite(point) || point <= 0) {
        return apiError("يجب تحديد عدد النقاط المراد تحويلها", 400);
    }

    try {
        const res = await fetch(
            `${BACKEND_URL}/api/v1/customer/loyalty-point/point-transfer`,
            {
                method: "POST",
                headers: authHeaders(token),
                body: JSON.stringify({ point }),
            },
        );

        const json = await res.json();
        if (!res.ok) {
            return apiError(
                extractBackendError(json, "فشل في تحويل النقاط"),
                res.status,
            );
        }

        return apiSuccess(json?.data ?? json);
    } catch {
        return apiError("فشل في تحويل النقاط إلى المحفظة", 502);
    }
}

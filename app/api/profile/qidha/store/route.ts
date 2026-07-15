import { cookies } from "next/headers";

import { COOKIE_KEYS } from "@/features/auth/types/auth.types";
import { QIDHA_ENDPOINTS } from "@/features/profile/constants/qidha.constants";
import { apiError, apiSuccess, extractBackendError } from "@/shared/lib/api-response";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

/**
 * BFF for POST /api/qidha-wallet/store (multipart/form-data).
 * Flutter headers: Authorization + Accept only (no moduleId / zoneId / Content-Type).
 */
export async function POST(req: Request) {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_KEYS.ACCESS_TOKEN)?.value;
    if (!token) return apiError("Unauthorized", 401);
    if (!BACKEND_URL) return apiError("API URL not configured", 500);

    let formData: FormData;
    try {
        formData = await req.formData();
    } catch {
        return apiError("Invalid form data", 400);
    }

    try {
        const res = await fetch(`${BACKEND_URL}${QIDHA_ENDPOINTS.store}`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
                // Do not set Content-Type — fetch sets multipart boundary automatically.
            },
            body: formData,
        });

        const text = await res.text();
        let json: unknown = null;
        if (text) {
            try {
                json = JSON.parse(text);
            } catch {
                json = null;
            }
        }

        if (!res.ok) {
            return apiError(
                extractBackendError(json, "فشل في إنشاء محفظة قيدها"),
                res.status,
            );
        }

        if (
            json &&
            typeof json === "object" &&
            "success" in json &&
            (json as { success: unknown }).success === false
        ) {
            return apiError(
                extractBackendError(json, "فشل في إنشاء محفظة قيدها"),
                400,
            );
        }

        const data =
            json && typeof json === "object" && "data" in json
                ? (json as { data: unknown }).data
                : json;

        return apiSuccess(data ?? { ok: true });
    } catch {
        return apiError("فشل في إنشاء محفظة قيدها", 502);
    }
}

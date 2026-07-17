import { QIDHA_ENDPOINTS } from "@/features/profile/constants/qidha.constants";
import {
    FINANCIAL_API,
    getFinancialToken,
    qidhaStoreHeaders,
    resolveFinancialLang,
} from "@/features/profile/lib/financial-http";
import { apiError, apiSuccess, extractBackendError } from "@/shared/lib/api-response";
import type { NextRequest } from "next/server";

const BACKEND_URL = FINANCIAL_API.baseUrl;

/**
 * BFF for POST /api/qidha-wallet/store (multipart/form-data).
 * Flutter headers: Authorization + Accept only (no moduleId / zoneId / Content-Type).
 */
export async function POST(req: NextRequest) {
    const token = await getFinancialToken();
    if (!token) return apiError("Unauthorized", 401);
    if (!BACKEND_URL) return apiError("API URL not configured", 500);

    let formData: FormData;
    try {
        formData = await req.formData();
    } catch {
        return apiError("Invalid form data", 400);
    }

    const lang = resolveFinancialLang(req);
    const isArabic = lang === "ar";

    try {
        const res = await fetch(`${BACKEND_URL}${QIDHA_ENDPOINTS.store}`, {
            method: "POST",
            // Do not set Content-Type — fetch sets the multipart boundary.
            headers: qidhaStoreHeaders(token, lang),
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

        const fallback = isArabic
            ? "فشل في إنشاء محفظة قيدها"
            : "Failed to create Qidha wallet";

        if (!res.ok) {
            return apiError(
                extractBackendError(json, fallback),
                res.status,
                json && typeof json === "object"
                    ? (json as { errors?: unknown }).errors
                    : undefined,
            );
        }

        if (
            json &&
            typeof json === "object" &&
            "success" in json &&
            (json as { success: unknown }).success === false
        ) {
            return apiError(
                extractBackendError(json, fallback),
                400,
                (json as { errors?: unknown }).errors,
            );
        }

        const data =
            json && typeof json === "object" && "data" in json
                ? (json as { data: unknown }).data
                : json;

        return apiSuccess(data ?? { ok: true });
    } catch {
        return apiError(
            isArabic
                ? "فشل في إنشاء محفظة قيدها"
                : "Failed to create Qidha wallet",
            502,
        );
    }
}

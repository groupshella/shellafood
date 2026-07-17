import { type NextRequest } from "next/server";

import {
    customerHeaders,
    FINANCIAL_API,
    getFinancialToken,
    resolveFinancialLang,
} from "@/features/profile/lib/financial-http";
import { normalizeSaudiPhone } from "@/features/profile/lib/wallet-validation";
import type { ValidateWalletRecipientRequest } from "@/features/profile/types/wallet.types";
import {
    apiError,
    apiSuccess,
    extractBackendError,
    isBackendFailure,
} from "@/shared/lib/api-response";

const BACKEND_URL = FINANCIAL_API.baseUrl;

export async function POST(req: NextRequest) {
    const lang = resolveFinancialLang(req);
    const token = await getFinancialToken();
    if (!token) return apiError(lang === "ar" ? "غير مصرح" : "Unauthorized", 401);

    let body: ValidateWalletRecipientRequest;
    try {
        body = (await req.json()) as ValidateWalletRecipientRequest;
    } catch {
        return apiError(lang === "ar" ? "بيانات الطلب غير صالحة" : "Invalid request body", 400);
    }
    const phone = normalizeSaudiPhone(body.phone ?? "");
    if (!phone) {
        return apiError(lang === "ar" ? "رقم جوال سعودي صحيح مطلوب" : "A valid Saudi mobile number is required", 400);
    }
    body = { phone };

    try {
        const res = await fetch(
            `${BACKEND_URL}/api/v1/customer/wallet/validate-recipient`,
            {
                method: "POST",
                headers: customerHeaders(token, lang),
                body: JSON.stringify(body),
            },
        );

        const json = await res.json();
        if (!res.ok) {
            return apiError(
                extractBackendError(
                    json,
                    lang === "ar" ? "التحقق من المستلِم فشل" : "Recipient validation failed",
                ),
                res.status,
                json?.errors,
            );
        }
        if (isBackendFailure(json)) {
            return apiError(
                extractBackendError(
                    json,
                    lang === "ar" ? "التحقق من المستلِم فشل" : "Recipient validation failed",
                ),
                400,
                json.errors,
            );
        }
        return apiSuccess(json?.data ?? json);
    } catch {
        return apiError(
            lang === "ar" ? "التحقق من المستلِم فشل" : "Recipient validation failed",
            502,
        );
    }
}

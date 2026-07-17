import { type NextRequest } from "next/server";

import {
    customerHeaders,
    FINANCIAL_API,
    getFinancialToken,
    resolveFinancialLang,
} from "@/features/profile/lib/financial-http";
import { normalizeSaudiPhone } from "@/features/profile/lib/wallet-validation";
import type { AddWalletRecipientRequest } from "@/features/profile/types/wallet.types";
import {
    apiError,
    apiSuccess,
    extractBackendError,
    isBackendFailure,
} from "@/shared/lib/api-response";

const BACKEND_URL = FINANCIAL_API.baseUrl;

export async function GET(req: NextRequest) {
    const lang = resolveFinancialLang(req);
    const token = await getFinancialToken();
    if (!token) return apiError(lang === "ar" ? "غير مصرح" : "Unauthorized", 401);

    try {
        const res = await fetch(`${BACKEND_URL}/api/v1/customer/wallet/recipients`, {
            headers: customerHeaders(token, lang),
            cache: "no-store",
        });

        const json = await res.json();
        if (!res.ok) {
            return apiError(
                extractBackendError(
                    json,
                    lang === "ar" ? "فشل في جلب المستلمين" : "Failed to load recipients",
                ),
                res.status,
                json?.errors,
            );
        }
        if (isBackendFailure(json)) {
            return apiError(
                extractBackendError(
                    json,
                    lang === "ar" ? "فشل في جلب المستلمين" : "Failed to load recipients",
                ),
                400,
                json.errors,
            );
        }
        return apiSuccess(json?.data ?? json);
    } catch {
        return apiError(
            lang === "ar" ? "فشل في جلب المستلمين" : "Failed to load recipients",
            502,
        );
    }
}

export async function POST(req: NextRequest) {
    const lang = resolveFinancialLang(req);
    const token = await getFinancialToken();
    if (!token) return apiError(lang === "ar" ? "غير مصرح" : "Unauthorized", 401);

    let body: AddWalletRecipientRequest;
    try {
        body = (await req.json()) as AddWalletRecipientRequest;
    } catch {
        return apiError(lang === "ar" ? "بيانات الطلب غير صالحة" : "Invalid request body", 400);
    }
    const recipientPhone = normalizeSaudiPhone(body.recipient_phone ?? "");
    if (!recipientPhone || !body.recipient_name?.trim()) {
        return apiError(
            lang === "ar" ? "اسم ورقم جوال سعودي صحيح مطلوبان" : "A recipient name and valid Saudi mobile are required",
            400,
        );
    }
    body = { ...body, recipient_phone: recipientPhone };

    try {
        const res = await fetch(
            `${BACKEND_URL}/api/v1/customer/wallet/recipients/add`,
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
                    lang === "ar" ? "فشل في إضافة المستلِم" : "Failed to add recipient",
                ),
                res.status,
                json?.errors,
            );
        }
        if (isBackendFailure(json)) {
            return apiError(
                extractBackendError(
                    json,
                    lang === "ar" ? "فشل في إضافة المستلِم" : "Failed to add recipient",
                ),
                400,
                json.errors,
            );
        }
        return apiSuccess(json?.data ?? json);
    } catch {
        return apiError(
            lang === "ar" ? "فشل في إضافة المستلِم" : "Failed to add recipient",
            502,
        );
    }
}

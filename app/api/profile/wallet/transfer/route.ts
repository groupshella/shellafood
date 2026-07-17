import { type NextRequest } from "next/server";

import {
    customerHeaders,
    FINANCIAL_API,
    getFinancialToken,
    resolveFinancialLang,
} from "@/features/profile/lib/financial-http";
import { normalizeSaudiPhone } from "@/features/profile/lib/wallet-validation";
import type { WalletTransferRequest } from "@/features/profile/types/wallet.types";
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

    let body: WalletTransferRequest;
    try {
        body = (await req.json()) as WalletTransferRequest;
    } catch {
        return apiError(lang === "ar" ? "بيانات الطلب غير صالحة" : "Invalid request body", 400);
    }
    const recipientPhone = normalizeSaudiPhone(body.recipient_phone ?? "");
    if (
        !recipientPhone ||
        !Number.isFinite(body.amount) ||
        body.amount <= 0 ||
        !["wallet", "wallet_qidha"].includes(body.payment_source)
    ) {
        return apiError(
            lang === "ar" ? "بيانات التحويل غير صالحة" : "Invalid transfer details",
            400,
        );
    }
    body = { ...body, recipient_phone: recipientPhone };

    try {
        const res = await fetch(`${BACKEND_URL}/api/v1/customer/wallet/transfer`, {
            method: "POST",
            headers: customerHeaders(token, lang),
            body: JSON.stringify(body),
        });

        const json = await res.json();
        if (!res.ok) {
            return apiError(
                extractBackendError(
                    json,
                    lang === "ar" ? "فشل في تنفيذ التحويل" : "Transfer failed",
                ),
                res.status,
                json?.errors,
            );
        }
        if (isBackendFailure(json)) {
            return apiError(
                extractBackendError(
                    json,
                    lang === "ar" ? "فشل في تنفيذ التحويل" : "Transfer failed",
                ),
                400,
                json.errors,
            );
        }
        return apiSuccess(json?.data ?? json);
    } catch {
        return apiError(lang === "ar" ? "فشل في تنفيذ التحويل" : "Transfer failed", 502);
    }
}

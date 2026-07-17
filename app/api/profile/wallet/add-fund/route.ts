import { type NextRequest } from "next/server";

import {
    customerHeaders,
    FINANCIAL_API,
    getFinancialToken,
    resolveFinancialLang,
} from "@/features/profile/lib/financial-http";
import type { WalletAddFundRequest } from "@/features/profile/types/wallet.types";
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

    let body: WalletAddFundRequest;
    try {
        body = (await req.json()) as WalletAddFundRequest;
    } catch {
        return apiError(lang === "ar" ? "بيانات الطلب غير صالحة" : "Invalid request body", 400);
    }

    let callback: URL;
    try {
        callback = new URL(body.callback);
    } catch {
        return apiError(lang === "ar" ? "رابط العودة غير صالح" : "Invalid callback URL", 400);
    }
    if (
        !Number.isFinite(body.amount) ||
        body.amount <= 0 ||
        body.payment_method !== "myfatoorah" ||
        body.payment_platform !== "web" ||
        !["http:", "https:"].includes(callback.protocol) ||
        callback.origin !== req.nextUrl.origin ||
        callback.pathname !== "/profile/wallet/payment/return"
    ) {
        return apiError(
            lang === "ar" ? "بيانات إضافة الرصيد غير صالحة" : "Invalid add-fund details",
            400,
        );
    }

    const fallback =
        lang === "ar" ? "فشل في بدء عملية الدفع" : "Failed to start payment";
    const serviceUnavailable =
        lang === "ar"
            ? "تعذر إكمال إضافة الرصيد حالياً. حاول مرة أخرى."
            : "Could not start wallet top-up right now. Please try again.";

    if (!BACKEND_URL) {
        return apiError(
            lang === "ar" ? "إعدادات الخدمة غير مكتملة" : "Payment service is not configured",
            500,
        );
    }

    try {
        const res = await fetch(`${BACKEND_URL}/api/v1/customer/wallet/add-fund`, {
            method: "POST",
            headers: customerHeaders(token, lang),
            body: JSON.stringify(body),
        });

        const raw = await res.text();
        let json: unknown = null;
        if (raw) {
            try {
                json = JSON.parse(raw);
            } catch {
                json = null;
            }
        }

        if (!res.ok) {
            const backendMessage = extractBackendError(json, fallback);
            const isServerError = res.status >= 500;
            const isOpaque =
                /server error|internal server error|sqlstate|exception|stack trace/i.test(
                    backendMessage,
                );
            return apiError(
                isServerError || isOpaque ? serviceUnavailable : backendMessage,
                res.status >= 500 ? 502 : res.status,
                json && typeof json === "object" && "errors" in json
                    ? (json as { errors?: unknown }).errors
                    : undefined,
            );
        }
        if (isBackendFailure(json)) {
            return apiError(
                extractBackendError(json, fallback),
                400,
                json.errors,
            );
        }
        return apiSuccess(
            json && typeof json === "object" && "data" in json
                ? (json as { data: unknown }).data
                : json,
        );
    } catch {
        return apiError(serviceUnavailable, 502);
    }
}

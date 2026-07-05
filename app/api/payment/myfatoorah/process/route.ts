import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { apiSuccess, apiError, extractBackendError } from "@/shared/lib/api-response";
import { COOKIE_KEYS } from "@/features/auth/types/auth.types";
import type { ProcessPaymentRequest, ProcessPaymentData } from "@/features/payment/types/payment.types";

/**
 * BFF proxy for POST /api/v1/payment/myfatoorah/process.
 *
 * Creates a hosted MyFatoorah payment page for an existing order and returns:
 *   payment_url — open this URL (redirect or new tab) for the user to pay
 *   invoice_id  — store this; needed to verify the payment via /check-status
 *
 * The backend controls the gateway return URLs for this flow; web cannot override
 * them here (only the /process-without-order endpoint accepts custom callback_url).
 */
export async function POST(request: NextRequest) {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get(COOKIE_KEYS.ACCESS_TOKEN)?.value;

    if (!accessToken) {
        return apiError("Unauthorized", 401);
    }

    let body: ProcessPaymentRequest;
    try {
        body = await request.json();
    } catch {
        return apiError("Invalid request body", 400);
    }

    if (!body.order_id || !body.amount || !body.payment_method_id || !body.customer_phone) {
        return apiError("Missing required payment fields", 400);
    }

    try {
        const backendRes = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/v1/payment/myfatoorah/process`,
            {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json; charset=UTF-8",
                    Authorization: `Bearer ${accessToken}`,
                    "X-localization": "ar",
                    zoneId: process.env.ZONE_ID ?? "[2]",
                    moduleId: process.env.MODULE_ID ?? "3",
                },
                body: JSON.stringify({
                    order_id: body.order_id,
                    amount: body.amount,
                    currency: body.currency,
                    payment_method_id: body.payment_method_id,
                    customer_name: body.customer_name,
                    customer_phone: body.customer_phone,
                    customer_email: body.customer_email,
                }),
                cache: "no-store",
            }
        );

        const json = await backendRes.json();

        if (!backendRes.ok || !json?.success) {
            return apiError(extractBackendError(json, "Failed to process payment"), backendRes.status);
        }

        // The backend may nest fields under data or at the root level — handle both.
        const paymentUrl: string | undefined =
            json.data?.payment_url ?? json.payment_url;

        const invoiceId: string | number | undefined =
            json.data?.invoice_id ??
            json.data?.InvoiceId ??
            json.data?.invoiceId ??
            json.invoice_id ??
            json.InvoiceId;

        if (!paymentUrl || invoiceId === undefined || invoiceId === null) {
            return apiError("Payment processed but missing payment_url or invoice_id", 502);
        }

        return apiSuccess<ProcessPaymentData>({
            payment_url: paymentUrl,
            invoice_id: String(invoiceId),
        });
    } catch {
        return apiError("Payment process request failed", 502);
    }
}

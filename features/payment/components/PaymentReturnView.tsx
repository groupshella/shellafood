"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle, Clock, Loader2 } from "lucide-react";
import { useCheckPaymentStatus } from "@/features/payment/hooks/useCheckPaymentStatus";
import { INVOICE_STORAGE_KEY } from "@/features/payment/components/HostedPaymentFlow";
import { classifyPaymentResult } from "@/features/payment/types/payment.types";
import type { PaymentResult } from "@/features/payment/types/payment.types";

interface PaymentReturnViewProps {
    /** invoiceId / paymentId from the URL — may be provided if the backend redirects here. */
    invoiceIdParam?: string;
    paymentIdParam?: string;
}

/**
 * Client component rendered on /checkout/payment/return.
 *
 * Resolution order for the invoice key:
 *   1. invoiceIdParam from URL search params (if backend redirects with ?invoiceId=…)
 *   2. paymentIdParam from URL search params (MyFatoorah may append paymentId on return)
 *   3. sessionStorage key set by HostedPaymentFlow before the redirect
 *
 * Verifies via POST /check-status (single call — no polling, mirrors the mobile app).
 */
export function PaymentReturnView({ invoiceIdParam, paymentIdParam }: PaymentReturnViewProps) {
    const router = useRouter();
    const { checkStatus } = useCheckPaymentStatus();

    const [result, setResult] = useState<PaymentResult | null>(null);
    const [isChecking, setIsChecking] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const verify = useCallback(async () => {
        const storedInvoiceId =
            typeof window !== "undefined"
                ? sessionStorage.getItem(INVOICE_STORAGE_KEY)
                : null;

        const invoiceId = invoiceIdParam ?? storedInvoiceId ?? null;
        const paymentId = paymentIdParam ?? null;

        const key = invoiceId ?? paymentId;
        const keyType: "InvoiceId" | "PaymentId" =
            invoiceId ? "InvoiceId" : "PaymentId";

        if (!key) {
            setError("لم يتم العثور على معرف الدفع. يرجى مراجعة طلباتك.");
            setIsChecking(false);
            return;
        }

        try {
            const data = await checkStatus({ key_type: keyType, key });
            sessionStorage.removeItem(INVOICE_STORAGE_KEY);
            setResult(classifyPaymentResult(data));
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "تعذر التحقق من حالة الدفع");
        } finally {
            setIsChecking(false);
        }
    }, [checkStatus, invoiceIdParam, paymentIdParam]);

    useEffect(() => {
        verify();
    }, [verify]);

    if (isChecking) {
        return (
            <div className="flex flex-col items-center justify-center gap-3 py-20" dir="rtl">
                <Loader2 className="h-8 w-8 animate-spin text-[#30913F]" />
                <p className="text-[14px] text-gray-500">جاري التحقق من حالة الدفع...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center gap-4 rounded-2xl bg-red-50 p-8" dir="rtl">
                <AlertCircle className="h-12 w-12 text-red-500" />
                <p className="text-center text-[14px] text-red-700">{error}</p>
                <button
                    type="button"
                    onClick={() => router.push("/")}
                    className="rounded-xl bg-[#30913F] px-6 py-2.5 text-[14px] font-semibold text-white active:opacity-80"
                >
                    الرئيسية
                </button>
            </div>
        );
    }

    if (result === "success") {
        return (
            <div className="flex flex-col items-center gap-4 rounded-2xl bg-[#EBFEEB] p-8" dir="rtl">
                <CheckCircle className="h-14 w-14 text-[#267332]" />
                <h2 className="text-[18px] font-bold text-[#267332]">تمت عملية الدفع بنجاح</h2>
                <p className="text-center text-[13px] text-gray-600">
                    تم تأكيد طلبك وسيتم معالجته قريباً
                </p>
                <button
                    type="button"
                    onClick={() => router.push("/orders")}
                    className="mt-2 rounded-xl bg-[#267332] px-6 py-2.5 text-[14px] font-semibold text-white active:opacity-80"
                >
                    تتبع طلبك
                </button>
            </div>
        );
    }

    if (result === "pending") {
        return (
            <div className="flex flex-col items-center gap-4 rounded-2xl bg-amber-50 p-8" dir="rtl">
                <Clock className="h-14 w-14 text-amber-500" />
                <h2 className="text-[18px] font-bold text-amber-700">الدفع قيد المعالجة</h2>
                <p className="text-center text-[13px] text-gray-600">
                    جاري معالجة عملية الدفع. سيتم تحديث حالة طلبك تلقائياً
                </p>
                <button
                    type="button"
                    onClick={() => router.push("/orders")}
                    className="mt-2 rounded-xl bg-amber-500 px-6 py-2.5 text-[14px] font-semibold text-white active:opacity-80"
                >
                    عرض الطلبات
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center gap-4 rounded-2xl bg-red-50 p-8" dir="rtl">
            <AlertCircle className="h-14 w-14 text-red-500" />
            <h2 className="text-[18px] font-bold text-red-700">فشلت عملية الدفع</h2>
            <p className="text-center text-[13px] text-gray-600">
                لم تكتمل عملية الدفع. يرجى المحاولة مرة أخرى
            </p>
            <button
                type="button"
                onClick={() => router.back()}
                className="mt-2 rounded-xl bg-red-500 px-6 py-2.5 text-[14px] font-semibold text-white active:opacity-80"
            >
                حاول مجدداً
            </button>
        </div>
    );
}

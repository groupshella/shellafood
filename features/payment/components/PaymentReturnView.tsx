"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle, Clock, Loader2 } from "lucide-react";
import { useCheckPaymentStatus } from "@/features/payment/hooks/useCheckPaymentStatus";
import { INVOICE_STORAGE_KEY } from "@/features/payment/components/HostedPaymentFlow";
import { classifyPaymentResult } from "@/features/payment/types/payment.types";
import type { PaymentResult } from "@/features/payment/types/payment.types";
interface PaymentReturnViewProps {
    invoiceIdParam?: string;
    paymentIdParam?: string;
    isArabic: boolean;
}

const ACTION_BTN = [
    "inline-flex min-h-[44px] items-center justify-center rounded-xl px-6 py-2.5 text-sm font-semibold text-white transition-opacity active:opacity-80",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-950",
].join(" ");

export function PaymentReturnView({ invoiceIdParam, paymentIdParam, isArabic }: PaymentReturnViewProps) {
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
            setError(isArabic ? "لم يتم العثور على معرف الدفع. يرجى مراجعة طلباتك." : "Payment ID not found. Please check your orders.");
            setIsChecking(false);
            return;
        }

        try {
            const data = await checkStatus({ key_type: keyType, key });
            sessionStorage.removeItem(INVOICE_STORAGE_KEY);
            setResult(classifyPaymentResult(data));
        } catch (err: unknown) {
            setError(err instanceof Error ? isArabic ? "تعذر التحقق من حالة الدفع" : "Failed to check payment status" : (err as Error).message);
        } finally {
            setIsChecking(false);
        }
    }, [checkStatus, invoiceIdParam, paymentIdParam]);

    useEffect(() => {
        verify();
    }, [verify]);

    if (isChecking) {
        return (
            <div className="flex flex-col items-center justify-center gap-3 py-20 sm:py-24" dir="rtl" aria-busy="true">
                <Loader2 className="h-8 w-8 animate-spin text-[#30913F] dark:text-[#4db860]" />
                <p className="text-sm text-gray-500 dark:text-gray-400">{isArabic ? "جاري التحقق من حالة الدفع..." : "Checking payment status..."}</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center gap-4 rounded-2xl bg-red-50 p-6 sm:p-8 dark:bg-red-950/30" dir={isArabic ? "rtl" : "ltr"} role="alert">
                <AlertCircle className="h-12 w-12 text-red-500 dark:text-red-400" />
                <p className="text-center text-sm text-red-700 dark:text-red-300">{error}</p>
                <Link
                    href="/"
                    className={`${ACTION_BTN} bg-[#30913F] focus-visible:ring-[#30913F]`}
                >
                    {isArabic ? "الرئيسية" : "Home"}
                </Link>
            </div>
        );
    }

    if (result === "success") {
        return (
            <div className="flex flex-col items-center gap-4 rounded-2xl bg-[#EBFEEB] p-6 sm:p-8 dark:bg-[#0d2e12]/50" dir="rtl">
                <CheckCircle className="h-14 w-14 text-[#267332] dark:text-[#4db860]" />
                <h2 className="text-lg font-bold text-[#267332] dark:text-[#4db860] sm:text-xl">{isArabic ? "تمت عملية الدفع بنجاح" : "Payment successful"}</h2>
                <p className="text-center text-[13px] text-gray-600 dark:text-gray-300">
                    {isArabic ? "تم تأكيد طلبك وسيتم معالجته قريباً" : "Your order has been confirmed and will be processed soon"}
                </p>
                <Link
                    href="/orders"
                    className={`${ACTION_BTN} mt-2 bg-[#267332] focus-visible:ring-[#267332]`}
                >
                    {isArabic ? "تتبع طلبك" : "Track your order"}
                </Link>
            </div>
        );
    }

    if (result === "pending") {
        return (
            <div className="flex flex-col items-center gap-4 rounded-2xl bg-amber-50 p-6 sm:p-8 dark:bg-amber-950/30" dir={isArabic ? "rtl" : "ltr"}>
                <Clock className="h-14 w-14 text-amber-500 dark:text-amber-400" />
                <h2 className="text-lg font-bold text-amber-700 dark:text-amber-300 sm:text-xl">{isArabic ? "الدفع قيد المعالجة" : "Payment processing"}</h2>
                <p className="text-center text-[13px] text-gray-600 dark:text-gray-300">
                    {isArabic ? "جاري معالجة عملية الدفع. سيتم تحديث حالة طلبك تلقائياً" : "Payment is being processed. Your order status will be updated automatically"}
                </p>
                <Link
                    href="/orders"
                    className={`${ACTION_BTN} mt-2 bg-amber-500 focus-visible:ring-amber-500`}
                >
                    {isArabic ? "عرض الطلبات" : "View orders"}
                </Link>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center gap-4 rounded-2xl bg-red-50 p-6 sm:p-8 dark:bg-red-950/30" dir={isArabic ? "rtl" : "ltr"}>
            <AlertCircle className="h-14 w-14 text-red-500 dark:text-red-400" />
            <h2 className="text-lg font-bold text-red-700 dark:text-red-300 sm:text-xl">{isArabic ? "فشلت عملية الدفع" : "Payment failed"}</h2>
            <p className="text-center text-[13px] text-gray-600 dark:text-gray-300">
                {isArabic ? "لم تكتمل عملية الدفع. يرجى المحاولة مرة أخرى" : "Payment failed. Please try again"}
            </p>
            <button
                type="button"
                onClick={() => router.back()}
                className={`${ACTION_BTN} mt-2 bg-red-500 focus-visible:ring-red-500`}
            >
                {isArabic ? "حاول مجدداً" : "Try again"}
            </button>
        </div>
    );
}

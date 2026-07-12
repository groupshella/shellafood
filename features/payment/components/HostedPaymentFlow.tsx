"use client";

import { useCallback, useEffect, useState } from "react";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { useGetPaymentMethods } from "@/features/payment/hooks/useGetPaymentMethods";
import { useProcessPayment } from "@/features/payment/hooks/useProcessPayment";
import type { PaymentMethod } from "@/features/payment/types/payment.types";
export const INVOICE_STORAGE_KEY = "mf_pending_invoice_id";

interface HostedPaymentFlowProps {
    orderId: number;
    amount: number;
    currency: string;
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    isArabic: boolean;
}

type ScreenState = "loading_methods" | "select_method" | "processing" | "failed";

function MethodLogo({ method }: { method: PaymentMethod }) {
    if (method.ImageUrl) {
        return (
            // eslint-disable-next-line @next/next/no-img-element
            <img
                src={method.ImageUrl}
                alt=""
                width={56}
                height={32}
                className="h-8 w-14 object-contain"
                loading="lazy"
            />
        );
    }

    const code = method.PaymentMethodCode?.toLowerCase() ?? "";
    const label =
        code === "vm" || code === "visa"
            ? "VISA"
            : code === "md" || code === "mada"
                ? "mada"
                : code === "stc"
                    ? "STC"
                    : code === "ap" || code.includes("apple")
                        ? "Pay"
                        : method.PaymentMethodEn.slice(0, 4).toUpperCase();

    return (
        <div className="flex h-8 w-14 items-center justify-center rounded-md bg-gray-100 text-[10px] font-bold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
            {label}
        </div>
    );
}

export function HostedPaymentFlow({
    orderId,
    amount,
    currency,
    customerName,
    customerPhone,
    customerEmail,
    isArabic,
}: HostedPaymentFlowProps) {
    const { getPaymentMethods } = useGetPaymentMethods();
    const { processPayment } = useProcessPayment();

    const [screen, setScreen] = useState<ScreenState>("loading_methods");
    const [methods, setMethods] = useState<PaymentMethod[]>([]);
    const [selectedMethodId, setSelectedMethodId] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        getPaymentMethods(amount, currency)
            .then((data) => {
                if (cancelled) return;
                const list = Array.isArray(data) ? data : [];
                setMethods(list);
                if (list.length > 0) {
                    setSelectedMethodId(list[0].PaymentMethodId);
                }
                setScreen("select_method");
            })
            .catch((err: unknown) => {
                if (cancelled) return;
                setError(err instanceof Error ? err.message : "تعذر تحميل طرق الدفع");
                setScreen("failed");
            });

        return () => {
            cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handlePay = useCallback(async () => {
        if (selectedMethodId === null) return;

        setScreen("processing");
        setError(null);

        try {
            const { payment_url, invoice_id } = await processPayment({
                order_id: orderId,
                amount,
                currency,
                payment_method_id: selectedMethodId,
                customer_name: customerName || "Customer",
                customer_phone: customerPhone,
                customer_email: customerEmail || "no-reply@shelafood.com",
            });

            sessionStorage.setItem(INVOICE_STORAGE_KEY, invoice_id);
            window.location.href = payment_url;
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "تعذر إتمام الدفع");
            setScreen("select_method");
        }
    }, [
        selectedMethodId,
        processPayment,
        orderId,
        amount,
        currency,
        customerName,
        customerPhone,
        customerEmail,
    ]);

    const selectedMethod =
        methods.find((m) => m.PaymentMethodId === selectedMethodId) ?? null;
    const serviceCharge = selectedMethod?.ServiceCharge ?? 0;
    const totalAmount = selectedMethod?.TotalAmount ?? amount + serviceCharge;

    return (
        <div className="space-y-4" dir={isArabic ? "rtl" : "ltr"}>
            <div className="rounded-xl border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                <p className="text-[13px] text-gray-500 dark:text-gray-400">
                    {isArabic ? "طلب رقم #" : "Order #"} #{orderId}
                </p>
                <p className="mt-1 text-[20px] font-bold tabular-nums text-gray-900 dark:text-gray-50">
                    {amount.toFixed(2)}{" "}
                    <span className="text-[14px] font-semibold">{currency}</span>
                </p>
            </div>

            {error && (
                <div
                    className="flex items-center gap-2 rounded-xl bg-red-50 p-3 dark:bg-red-950/40"
                    role="alert"
                >
                    <AlertCircle className="h-4 w-4 shrink-0 text-red-600 dark:text-red-400" />
                    <p className="text-[13px] text-red-700 dark:text-red-300">{error}</p>
                </div>
            )}

            {screen === "loading_methods" && (
                <div
                    className="flex flex-col items-center justify-center gap-3 py-16 sm:py-20"
                    aria-busy="true"
                >
                    <Loader2 className="h-6 w-6 animate-spin text-gray-400 dark:text-gray-500" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {isArabic ? "جاري تحميل طرق الدفع..." : "Loading payment methods..."}
                    </p>
                </div>
            )}

            {screen === "processing" && (
                <div
                    className="flex flex-col items-center justify-center gap-3 py-16 sm:py-20"
                    aria-busy="true"
                >
                    <Loader2 className="h-6 w-6 animate-spin text-[#30913F] dark:text-[#4db860]" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {isArabic ? "جاري تجهيز صفحة الدفع..." : "Preparing payment page..."}
                    </p>
                </div>
            )}

            {screen === "failed" && (
                <div className="flex flex-col items-center gap-3 py-12 text-center">
                    <AlertCircle className="h-8 w-8 text-red-500" />
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                        {error ?? (isArabic ? "تعذر تحميل طرق الدفع" : "Failed to load payment methods")}
                    </p>
                    <button
                        type="button"
                        onClick={() => window.location.reload()}
                        className="rounded-xl bg-[#30913F] px-5 py-2.5 text-sm font-semibold text-white"
                    >
                        {isArabic ? "إعادة المحاولة" : "Retry"}
                    </button>
                </div>
            )}

            {screen === "select_method" && (
                <>
                    <h2 className="text-[15px] font-semibold text-gray-800 dark:text-gray-100 sm:text-base">
                        {isArabic ? "اختر طريقة الدفع" : "Select payment method"}
                    </h2>

                    {methods.length === 0 ? (
                        <p className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                            {isArabic ? "لا توجد طرق دفع متاحة حالياً" : "No payment methods available currently"}
                        </p>
                    ) : (
                        <div className="space-y-3" role="radiogroup" aria-label={isArabic ? "طرق الدفع" : "Payment methods"}>
                            {methods.map((method) => {
                                const isSelected =
                                    selectedMethodId === method.PaymentMethodId;
                                return (
                                    <button
                                        key={method.PaymentMethodId}
                                        type="button"
                                        role="radio"
                                        aria-checked={isSelected}
                                        onClick={() =>
                                            setSelectedMethodId(method.PaymentMethodId)
                                        }
                                        className={[
                                            "flex w-full min-h-[64px] items-center gap-3 rounded-xl border p-3.5 text-right transition-colors sm:p-4",
                                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-950",
                                            isSelected
                                                ? "border-[#30913F] bg-[#F0FBF1] dark:border-[#30913F]/60 dark:bg-[#30913F]/10"
                                                : "border-gray-200 bg-white active:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:active:bg-gray-800",
                                        ].join(" ")}
                                    >
                                        <MethodLogo method={method} />

                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-medium text-gray-900 dark:text-gray-50">
                                                {method.PaymentMethodAr}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {method.PaymentMethodEn}
                                            </p>
                                            {(method.ServiceCharge ?? 0) > 0 && (
                                                <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                                                    {isArabic ? "رسوم الخدمة:" : "Service charge:"} {method.ServiceCharge}{" "}
                                                    {currency}
                                                </p>
                                            )}
                                        </div>

                                        {isSelected && (
                                            <CheckCircle
                                                className="h-5 w-5 shrink-0 text-[#30913F] dark:text-[#4db860]"
                                                aria-hidden
                                            />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {selectedMethod && (
                        <div className="space-y-3 pt-2">
                            <div className="space-y-1 rounded-xl bg-gray-50 p-3 text-[13px] text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                                <div className="flex justify-between gap-4">
                                    <span>{isArabic ? "المبلغ" : "Amount"}</span>
                                    <span className="tabular-nums">
                                        {amount.toFixed(2)} {currency}
                                    </span>
                                </div>
                                {serviceCharge > 0 && (
                                    <div className="flex justify-between gap-4">
                                        <span>{isArabic ? "رسوم الخدمة" : "Service charge"}</span>
                                        <span className="tabular-nums">
                                            {serviceCharge} {currency}
                                        </span>
                                    </div>
                                )}
                                <div className="flex justify-between gap-4 border-t border-gray-200 pt-1 font-semibold text-gray-900 dark:border-gray-700 dark:text-gray-50">
                                    <span>{isArabic ? "الإجمالي" : "Total"}</span>
                                    <span className="tabular-nums">
                                        {Number(totalAmount).toFixed(2)} {currency}
                                    </span>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={handlePay}
                                className="min-h-[48px] w-full rounded-xl bg-[#30913F] py-3.5 text-[15px] font-semibold text-white transition-opacity active:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-950"
                            >
                                {isArabic ? "ادفع الآن —" : "Pay now —"}     {methodLabel(selectedMethod)}
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

function methodLabel(method: PaymentMethod): string {
    return method.PaymentMethodAr;
}

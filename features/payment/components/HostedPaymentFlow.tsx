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
}

type ScreenState = "loading_methods" | "select_method" | "processing" | "failed";

export function HostedPaymentFlow({
    orderId,
    amount,
    currency,
    customerName,
    customerPhone,
    customerEmail,
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
                setMethods(data);
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
    }, [selectedMethodId, processPayment, orderId, amount, currency, customerName, customerPhone, customerEmail]);

    const selectedMethod = methods.find((m) => m.PaymentMethodId === selectedMethodId) ?? null;

    return (
        <div className="space-y-4" dir="rtl">
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
                <div className="flex flex-col items-center justify-center gap-3 py-16 sm:py-20" aria-busy="true">
                    <Loader2 className="h-6 w-6 animate-spin text-gray-400 dark:text-gray-500" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">جاري تحميل طرق الدفع...</p>
                </div>
            )}

            {screen === "processing" && (
                <div className="flex flex-col items-center justify-center gap-3 py-16 sm:py-20" aria-busy="true">
                    <Loader2 className="h-6 w-6 animate-spin text-[#30913F] dark:text-[#4db860]" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">جاري تجهيز صفحة الدفع...</p>
                </div>
            )}

            {screen === "select_method" && (
                <>
                    <h2 className="text-[15px] font-semibold text-gray-800 dark:text-gray-100 sm:text-base">
                        اختر طريقة الدفع
                    </h2>

                    <div className="space-y-3" role="radiogroup" aria-label="طرق الدفع">
                        {methods.map((method) => {
                            const isSelected = selectedMethodId === method.PaymentMethodId;
                            return (
                                <button
                                    key={method.PaymentMethodId}
                                    type="button"
                                    role="radio"
                                    aria-checked={isSelected}
                                    onClick={() => setSelectedMethodId(method.PaymentMethodId)}
                                    className={[
                                        "flex w-full min-h-[64px] items-center gap-3 rounded-xl border p-3.5 text-right transition-colors sm:p-4",
                                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-950",
                                        isSelected
                                            ? "border-[#30913F] bg-[#F0FBF1] dark:border-[#30913F]/60 dark:bg-[#30913F]/10"
                                            : "border-gray-200 bg-white active:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:active:bg-gray-800",
                                    ].join(" ")}
                                >
                                    {method.ImageUrl ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={method.ImageUrl}
                                            alt=""
                                            className="h-8 w-14 object-contain"
                                        />
                                    ) : (
                                        <div className="h-8 w-14 rounded bg-gray-100 dark:bg-gray-800" />
                                    )}

                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium text-gray-900 dark:text-gray-50">
                                            {method.PaymentMethodAr}
                                        </p>
                                        {(method.ServiceCharge ?? 0) > 0 && (
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                رسوم الخدمة: {method.ServiceCharge} {currency}
                                            </p>
                                        )}
                                    </div>

                                    {isSelected && (
                                        <CheckCircle className="h-5 w-5 shrink-0 text-[#30913F] dark:text-[#4db860]" aria-hidden />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {selectedMethod && (
                        <div className="space-y-3 pt-2">
                            {(selectedMethod.ServiceCharge ?? 0) > 0 && (
                                <div className="space-y-1 rounded-xl bg-gray-50 p-3 text-[13px] text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                                    <div className="flex justify-between gap-4">
                                        <span>المبلغ</span>
                                        <span className="tabular-nums">
                                            {amount} {currency}
                                        </span>
                                    </div>
                                    <div className="flex justify-between gap-4">
                                        <span>رسوم الخدمة</span>
                                        <span className="tabular-nums">
                                            {selectedMethod.ServiceCharge} {currency}
                                        </span>
                                    </div>
                                    <div className="flex justify-between gap-4 border-t border-gray-200 pt-1 font-semibold text-gray-900 dark:border-gray-700 dark:text-gray-50">
                                        <span>الإجمالي</span>
                                        <span className="tabular-nums">
                                            {selectedMethod.TotalAmount ?? amount} {currency}
                                        </span>
                                    </div>
                                </div>
                            )}

                            <button
                                type="button"
                                onClick={handlePay}
                                className="min-h-[48px] w-full rounded-xl bg-[#30913F] py-3.5 text-[15px] font-semibold text-white transition-opacity active:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-950"
                            >
                                ادفع الآن
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

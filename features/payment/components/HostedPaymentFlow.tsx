"use client";

import { useCallback, useEffect, useState } from "react";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { useGetPaymentMethods } from "@/features/payment/hooks/useGetPaymentMethods";
import { useProcessPayment } from "@/features/payment/hooks/useProcessPayment";
import type { PaymentMethod } from "@/features/payment/types/payment.types";

/**
 * sessionStorage key used to persist the invoice_id across the full-page redirect
 * to the MyFatoorah hosted payment page.  PaymentReturnView reads it back.
 */
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

            // Persist so PaymentReturnView can verify without relying on gateway URL params
            sessionStorage.setItem(INVOICE_STORAGE_KEY, invoice_id);

            // Full-page redirect to MyFatoorah hosted payment page
            window.location.href = payment_url;
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "تعذر إتمام الدفع");
            setScreen("select_method");
        }
    }, [selectedMethodId, processPayment, orderId, amount, currency, customerName, customerPhone, customerEmail]);

    const selectedMethod = methods.find((m) => m.PaymentMethodId === selectedMethodId) ?? null;

    return (
        <div className="space-y-4" dir="rtl">
            {/* Error banner */}
            {error && (
                <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3">
                    <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
                    <p className="text-[13px] text-red-700">{error}</p>
                </div>
            )}

            {/* Loading payment methods */}
            {screen === "loading_methods" && (
                <div className="flex flex-col items-center justify-center gap-3 py-16">
                    <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                    <p className="text-[14px] text-gray-500">جاري تحميل طرق الدفع...</p>
                </div>
            )}

            {/* Redirecting to gateway */}
            {screen === "processing" && (
                <div className="flex flex-col items-center justify-center gap-3 py-16">
                    <Loader2 className="h-6 w-6 animate-spin text-[#30913F]" />
                    <p className="text-[14px] text-gray-500">جاري تجهيز صفحة الدفع...</p>
                </div>
            )}

            {/* Method selection */}
            {screen === "select_method" && (
                <>
                    <h2 className="text-[15px] font-semibold text-gray-800">اختر طريقة الدفع</h2>

                    <div className="space-y-3">
                        {methods.map((method) => (
                            <button
                                key={method.PaymentMethodId}
                                type="button"
                                onClick={() => setSelectedMethodId(method.PaymentMethodId)}
                                className={`flex w-full items-center gap-3 rounded-xl border p-4 text-right transition-colors ${
                                    selectedMethodId === method.PaymentMethodId
                                        ? "border-[#30913F] bg-[#F0FBF1]"
                                        : "border-gray-200 bg-white active:bg-gray-50"
                                }`}
                            >
                                {method.ImageUrl ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={method.ImageUrl}
                                        alt={method.PaymentMethodAr}
                                        className="h-8 w-14 object-contain"
                                    />
                                ) : (
                                    <div className="h-8 w-14 rounded bg-gray-100" />
                                )}

                                <div className="flex-1">
                                    <p className="text-[14px] font-medium text-gray-900">
                                        {method.PaymentMethodAr}
                                    </p>
                                    {(method.ServiceCharge ?? 0) > 0 && (
                                        <p className="text-[12px] text-gray-500">
                                            رسوم الخدمة: {method.ServiceCharge} {currency}
                                        </p>
                                    )}
                                </div>

                                {selectedMethodId === method.PaymentMethodId && (
                                    <CheckCircle className="h-5 w-5 shrink-0 text-[#30913F]" />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Summary + Pay button */}
                    {selectedMethod && (
                        <div className="space-y-3 pt-2">
                            {(selectedMethod.ServiceCharge ?? 0) > 0 && (
                                <div className="rounded-xl bg-gray-50 p-3 text-[13px] text-gray-600 space-y-1">
                                    <div className="flex justify-between">
                                        <span>المبلغ</span>
                                        <span>
                                            {amount} {currency}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>رسوم الخدمة</span>
                                        <span>
                                            {selectedMethod.ServiceCharge} {currency}
                                        </span>
                                    </div>
                                    <div className="flex justify-between border-t border-gray-200 pt-1 font-semibold text-gray-900">
                                        <span>الإجمالي</span>
                                        <span>
                                            {selectedMethod.TotalAmount ?? amount} {currency}
                                        </span>
                                    </div>
                                </div>
                            )}

                            <button
                                type="button"
                                onClick={handlePay}
                                className="w-full rounded-xl bg-[#30913F] py-3.5 text-[15px] font-semibold text-white transition-opacity active:opacity-80"
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

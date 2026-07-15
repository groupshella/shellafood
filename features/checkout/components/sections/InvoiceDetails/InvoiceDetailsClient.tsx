"use client";

import { useCheckout } from "@/features/checkout/context/CheckoutContext";

interface InvoiceRowProps {
    label: string;
    value: string;
    isTotal?: boolean;
    muted?: boolean;
}

function InvoiceRow({ label, value, isTotal = false, muted = false }: InvoiceRowProps) {
    return (
        <div className="flex items-center justify-between gap-3" dir="rtl">
            <span
                className={[
                    "text-sm sm:text-[15px]",
                    isTotal
                        ? "font-bold text-[#30913F] dark:text-[#4db860]"
                        : muted
                          ? "text-gray-500 dark:text-gray-500"
                          : "text-gray-600 dark:text-gray-400",
                ].join(" ")}
            >
                {label}
            </span>
            <span
                className={[
                    "shrink-0 text-sm sm:text-[15px]",
                    isTotal
                        ? "font-bold text-[#30913F] dark:text-[#4db860]"
                        : muted
                          ? "font-medium text-gray-500 dark:text-gray-500"
                          : "font-medium text-gray-800 dark:text-gray-200",
                ].join(" ")}
            >
                {value}
            </span>
        </div>
    );
}

export function InvoiceDetailsClient() {
    const { invoice, deliveryMethod } = useCheckout();
    const showShippingBreakdown =
        deliveryMethod === "delivery" && invoice.firstKmDistance > 0;

    return (
        <div dir="rtl">
            <h2 className="mb-3 text-sm font-bold text-gray-900 dark:text-gray-50 sm:text-[15px]">
                تفاصيل الفاتورة
            </h2>

            <div className="rounded-2xl p-3.5 sm:p-4 lg:rounded-3xl lg:p-5">
                <div className="space-y-3 sm:space-y-3.5">
                    <InvoiceRow label="إجمالي المنتجات" value={invoice.subtotal} />

                    <InvoiceRow
                        label="مصاريف الشحن"
                        value={
                            deliveryMethod === "pickup" ? "مجاني (استلام)" : invoice.deliveryFee
                        }
                    />

                    {showShippingBreakdown && (
                        <div className="space-y-2 rounded-xl bg-gray-50 px-3 py-2.5 dark:bg-gray-800/60">
                            <InvoiceRow
                                label={`الرسوم لأول ${invoice.firstKmDistance} كم`}
                                value={invoice.firstKmFee}
                                muted
                            />
                            <InvoiceRow
                                label={
                                    invoice.extraKm > 0
                                        ? `رسوم إضافية (${invoice.perKmShippingCharge} / كم × ${invoice.extraKm} كم)`
                                        : `رسوم إضافية (${invoice.perKmShippingCharge} / كم)`
                                }
                                value={invoice.extraKmFee}
                                muted
                            />
                            <InvoiceRow
                                label="المسافة التقريبية"
                                value={`${invoice.distanceKm} كم`}
                                muted
                            />
                        </div>
                    )}

                    {invoice.showPackaging && (
                        <InvoiceRow label="رسوم التغليف الإضافي" value={invoice.packagingFee} />
                    )}

                    <InvoiceRow
                        label={`ضريبة القيمة المضافة (${invoice.taxPercent}%)`}
                        value={invoice.vat}
                    />
                    <InvoiceRow label="كود خصم" value={invoice.discount} />

                    {invoice.belowMinimumOrder && (
                        <p className="text-xs text-amber-600 dark:text-amber-400 sm:text-[13px]">
                            الحد الأدنى للطلب من هذا المتجر {invoice.minimumOrder}
                        </p>
                    )}

                    <div className="border-t border-gray-200 pt-3 dark:border-gray-700 sm:pt-3.5">
                        <InvoiceRow label="إجمالي الطلب" value={invoice.total} isTotal />
                    </div>
                </div>
            </div>
        </div>
    );
}

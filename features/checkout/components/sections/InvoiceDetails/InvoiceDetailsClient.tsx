"use client";

import type { CheckoutInvoice } from "@/features/checkout/types/checkout.types";

interface InvoiceDetailsClientProps {
    invoice: CheckoutInvoice;
}

interface InvoiceRowProps {
    label: string;
    value: string;
    isTotal?: boolean;
}

function InvoiceRow({ label, value, isTotal = false }: InvoiceRowProps) {
    return (
        <div className="flex items-center justify-between gap-3" dir="rtl">
            <span
                className={[
                    "text-sm sm:text-[15px]",
                    isTotal
                        ? "font-bold text-[#30913F] dark:text-[#4db860]"
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
                        : "font-medium text-gray-800 dark:text-gray-200",
                ].join(" ")}
            >
                {value}
            </span>
        </div>
    );
}

export function InvoiceDetailsClient({ invoice }: InvoiceDetailsClientProps) {
    return (
        <div dir="rtl">
            <h2 className="mb-3 text-sm font-bold text-gray-900 dark:text-gray-50 sm:text-[15px]">تفاصيل الفاتورة</h2>

            <div className="rounded-2xl bg-gray-100 p-3.5 dark:bg-gray-800 sm:p-4 lg:rounded-3xl lg:p-5">
                <div className="space-y-3 sm:space-y-3.5">
                    <InvoiceRow label="إجمالي المنتجات" value={invoice.subtotal} />
                    <InvoiceRow label="مصاريف الشحن" value={invoice.deliveryFee} />
                    <InvoiceRow label="رسوم الخدمة" value={invoice.serviceFee} />
                    <InvoiceRow label="كود خصم" value={invoice.discount} />
                    <div className="border-t border-gray-200 pt-3 dark:border-gray-700 sm:pt-3.5">
                        <InvoiceRow label="إجمالي الطلب" value={invoice.total} isTotal />
                    </div>
                </div>
            </div>
        </div>
    );
}

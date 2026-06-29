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
        <div className="flex items-center justify-between" dir="rtl">
            <span
                className={`text-[13px] ${
                    isTotal ? "font-bold text-[#30913F]" : "text-gray-700"
                }`}
            >
                {label}
            </span>
            <span
                className={`text-[13px] ${
                    isTotal ? "font-bold text-[#30913F]" : "text-gray-700"
                }`}
            >
                {value}
            </span>
        </div>
    );
}

export function InvoiceDetailsClient({ invoice }: InvoiceDetailsClientProps) {
    return (
        <div dir="rtl">
            <h2 className="mb-3 text-[15px] font-bold text-gray-900">تفاصيل الفاتورة</h2>

            <div className="rounded-2xl bg-[#F6F5F8] p-4">
                <div className="space-y-3">
                    <InvoiceRow label="إجمالي المنتجات" value={invoice.subtotal} />
                    <InvoiceRow label="مصاريف الشحن" value={invoice.deliveryFee} />
                    <InvoiceRow label="رسوم الخدمة" value={invoice.serviceFee} />
                    <InvoiceRow label="كود خصم" value={invoice.discount} />
                    <div className="border-t border-gray-200 pt-3">
                        <InvoiceRow label="إجمالي الطلب" value={invoice.total} isTotal />
                    </div>
                </div>
            </div>
        </div>
    );
}

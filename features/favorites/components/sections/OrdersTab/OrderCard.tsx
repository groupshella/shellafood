"use client";

import { useRouter } from "next/navigation";
import { Heart, Clock, ChevronLeft, Store } from "lucide-react";
import type { ApiOrder } from "@/features/favorites/types/favorites.types";

const STATUS_LABEL: Record<string, string> = {
    pending: "قيد الانتظار",
    confirmed: "مؤكد",
    processing: "جاري التحضير",
    out_for_delivery: "في الطريق",
    delivered: "مكتمل",
    cancelled: "ملغى",
    failed: "فشل",
};

const STATUS_STYLE: Record<string, { bg: string; text: string }> = {
    delivered: { bg: "bg-[#EBFEEB]", text: "text-[#30913F]" },
    pending: { bg: "bg-amber-50", text: "text-amber-600" },
    confirmed: { bg: "bg-[#EBFEEB]", text: "text-[#30913F]" },
    processing: { bg: "bg-amber-50", text: "text-amber-600" },
    out_for_delivery: { bg: "bg-blue-50", text: "text-blue-600" },
    cancelled: { bg: "bg-red-50", text: "text-red-500" },
    failed: { bg: "bg-red-50", text: "text-red-500" },
};

function getStyle(status: string) {
    return (
        STATUS_STYLE[status] ?? { bg: "bg-gray-100", text: "text-gray-600" }
    );
}

function formatDate(dateStr: string) {
    try {
        return new Date(dateStr).toLocaleString("ar-SA", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    } catch {
        return dateStr;
    }
}

export function OrderCard({ order }: { order: ApiOrder }) {
    const router = useRouter();
    const storeName =
        order.restaurant?.name ?? order.store?.name ?? "المتجر";
    const style = getStyle(order.order_status);
    const statusLabel =
        STATUS_LABEL[order.order_status] ?? order.order_status;

    return (
        <article
            onClick={() => router.push(`/my-orders/${order.id}`)}
            className="flex cursor-pointer items-stretch overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/[0.04] transition-transform active:scale-[0.99]"
        >
            {/* Left thumbnail area */}
            <div className="flex w-[80px] shrink-0 flex-col items-center justify-center gap-2 rounded-l-2xl bg-[#F6F5F8] py-4">
                <Store className="h-7 w-7 text-gray-300" strokeWidth={1.4} aria-hidden />
                <ChevronLeft className="h-4 w-4 text-gray-300" strokeWidth={2} aria-hidden />
            </div>

            {/* Right — text content */}
            <div className="flex flex-1 flex-col gap-1.5 px-4 py-3.5" dir="rtl">
                {/* Header row: heart + order number */}
                <div className="flex items-center gap-2">
                    <Heart
                        aria-hidden
                        className="h-4 w-4 shrink-0 fill-[#30913F] text-[#30913F]"
                        strokeWidth={0}
                    />
                    <span className="text-[15px] font-bold text-[#111B18]">
                        #{order.id}
                    </span>
                </div>

                {/* Store name */}
                <p className="text-[13px] font-semibold text-[#111B18]">
                    {storeName}
                </p>

                {/* Status pill */}
                <span
                    className={[
                        "w-fit rounded-full px-3 py-0.5 text-[11px] font-semibold",
                        style.bg,
                        style.text,
                    ].join(" ")}
                >
                    {statusLabel}
                </span>

                {/* Date row */}
                <div className="flex items-center gap-1.5">
                    <Clock
                        className="h-[13px] w-[13px] shrink-0 text-gray-400"
                        strokeWidth={1.6}
                        aria-hidden
                    />
                    <p className="text-[12px] text-gray-500">
                        تاريخ الطلب {formatDate(order.created_at)}
                    </p>
                </div>

                {/* Total */}
                <p className="text-[14px] font-bold text-[#111B18]">
                    إجمالي التكلفة{" "}
                    {order.order_amount?.toFixed(2)} ﷼
                </p>
            </div>
        </article>
    );
}

"use client";

import { memo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, Clock, ChevronLeft, ChevronRight, Store } from "lucide-react";
import type { FavoriteOrder } from "@/features/favorites/types/favorites.types";

const STATUS_LABEL: Record<string, { ar: string; en: string }> = {
    pending: { ar: "قيد الانتظار", en: "Pending" },
    confirmed: { ar: "مؤكد", en: "Confirmed" },
    processing: { ar: "جاري التحضير", en: "Preparing" },
    out_for_delivery: { ar: "في الطريق", en: "Out for delivery" },
    delivered: { ar: "مكتمل", en: "Delivered" },
    cancelled: { ar: "ملغى", en: "Cancelled" },
    failed: { ar: "فشل", en: "Failed" },
};

const STATUS_STYLE: Record<string, { bg: string; text: string }> = {
    delivered: { bg: "bg-brand/10", text: "text-brand" },
    pending: { bg: "bg-amber-50", text: "text-amber-600" },
    confirmed: { bg: "bg-brand/10", text: "text-brand" },
    processing: { bg: "bg-amber-50", text: "text-amber-600" },
    out_for_delivery: { bg: "bg-blue-50", text: "text-blue-600" },
    cancelled: { bg: "bg-red-50", text: "text-red-500" },
    failed: { bg: "bg-red-50", text: "text-red-500" },
};

function getStyle(status: string) {
    return STATUS_STYLE[status] ?? { bg: "bg-card", text: "text-muted" };
}

interface OrderCardProps {
    order: FavoriteOrder;
    isArabic: boolean;
}

export const OrderCard = memo(function OrderCard({ order, isArabic }: OrderCardProps) {
    const style = getStyle(order.order_status);
    const statusEntry = STATUS_LABEL[order.order_status];
    const statusLabel = statusEntry
        ? isArabic
            ? statusEntry.ar
            : statusEntry.en
        : order.order_status;
    const ChevronIcon = isArabic ? ChevronLeft : ChevronRight;

    return (
        <Link
            href={`/my-orders/${order.id}`}
            aria-label={
                isArabic
                    ? `طلب ${order.store_name} رقم ${order.id}`
                    : `Order ${order.id} from ${order.store_name}`
            }
            dir={isArabic ? "rtl" : "ltr"}
            lang={isArabic ? "ar" : "en"}
            className={[
                "flex h-full min-w-0 items-stretch overflow-hidden rounded-2xl bg-background shadow-sm ring-1 ring-border",
                "transition-transform active:scale-[0.99]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                "motion-safe:duration-200 md:hover:-translate-y-px",
                "md:hover:shadow-[0_2px_6px_rgba(0,0,0,0.05),0_8px_24px_rgba(0,0,0,0.08)]",
            ].join(" ")}
        >
            <div className="relative w-16 shrink-0 self-stretch bg-card sm:w-[4.5rem] md:w-20">
                {order.store_logo_url ? (
                    <Image
                        src={order.store_logo_url}
                        alt={order.store_name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 64px, 80px"
                        loading="lazy"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center">
                        <Store className="h-6 w-6 text-muted sm:h-7 sm:w-7" strokeWidth={1.4} aria-hidden />
                    </div>
                )}
            </div>

            <div className="flex min-w-0 flex-1 flex-col gap-1.5 px-3 py-3 sm:gap-2 sm:px-4 sm:py-3.5">
                <div className="flex items-center justify-end gap-1.5">
                    <span className="text-sm font-bold text-foreground sm:text-[15px]">
                        #{order.id}
                    </span>
                    <Heart
                        aria-hidden
                        className="h-4 w-4 shrink-0 fill-brand text-brand"
                        strokeWidth={0}
                    />
                </div>

                <p className="truncate text-start text-sm font-semibold text-foreground sm:text-[15px]">
                    {order.store_name}
                </p>

                <span
                    className={[
                        "w-fit rounded-full px-2.5 py-0.5 text-[11px] font-semibold sm:px-3 sm:text-xs",
                        style.bg,
                        style.text,
                    ].join(" ")}
                >
                    {statusLabel}
                </span>

                <div className="flex min-w-0 items-center gap-1.5">
                    <Clock className="h-3 w-3 shrink-0 text-muted sm:h-3.5 sm:w-3.5" strokeWidth={1.6} aria-hidden />
                    <p className="truncate text-xs text-muted sm:text-[13px]">
                        {isArabic ? "تاريخ الطلب" : "Order date"} {order.order_time}
                    </p>
                </div>

                <p className="text-start text-sm font-bold text-foreground sm:text-[15px]">
                    {isArabic ? "إجمالي التكلفة" : "Total"}{" "}
                    {order.order_amount?.toFixed(2) ?? 0} ﷼
                </p>
            </div>

            <div className="flex w-9 shrink-0 items-center justify-center self-stretch sm:w-10 md:w-11">
                <ChevronIcon className="h-4 w-4 text-muted sm:h-[18px] sm:w-[18px]" strokeWidth={2} aria-hidden />
            </div>
        </Link>
    );
});

"use client";

import { useRouter } from "next/navigation";
import { Heart, Clock, ChevronLeft, Store } from "lucide-react";
import type { ApiOrder } from "@/features/favorites/types/favorites.types";
import Image from "next/image";

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
    delivered: { bg: "bg-[#EBFEEB] dark:bg-[#0d2e12]", text: "text-[#30913F] dark:text-[#4db860]" },
    pending: { bg: "bg-amber-50 dark:bg-amber-950/40", text: "text-amber-600 dark:text-amber-400" },
    confirmed: { bg: "bg-[#EBFEEB] dark:bg-[#0d2e12]", text: "text-[#30913F] dark:text-[#4db860]" },
    processing: { bg: "bg-amber-50 dark:bg-amber-950/40", text: "text-amber-600 dark:text-amber-400" },
    out_for_delivery: { bg: "bg-blue-50 dark:bg-blue-950/40", text: "text-blue-600 dark:text-blue-400" },
    cancelled: { bg: "bg-red-50 dark:bg-red-950/40", text: "text-red-500 dark:text-red-400" },
    failed: { bg: "bg-red-50 dark:bg-red-950/40", text: "text-red-500 dark:text-red-400" },
};

function getStyle(status: string) {
    return STATUS_STYLE[status] ?? { bg: "bg-gray-100 dark:bg-gray-700", text: "text-gray-600 dark:text-gray-400" };
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
    const storeName = order.restaurant?.name ?? order.store?.name ?? "المتجر";
    const logoUrl = order.restaurant?.logo_full_url ?? order.store?.logo_full_url;
    const style = getStyle(order.order_status);
    const statusLabel = STATUS_LABEL[order.order_status] ?? order.order_status;

    return (
        <article
            onClick={() => router.push(`/my-orders/${order.id}`)}
            className="flex h-full min-w-0 cursor-pointer items-stretch overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/[0.04] transition-transform active:scale-[0.99] dark:bg-gray-800 dark:ring-white/[0.06]"
        >
            <div className="relative w-16 shrink-0 self-stretch bg-gray-100 dark:bg-gray-700 sm:w-[4.5rem] md:w-20">
                {logoUrl ? (
                    <Image
                        src={logoUrl}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 64px, 80px"
                        loading="lazy"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center">
                        <Store className="h-6 w-6 text-gray-300 dark:text-gray-500 sm:h-7 sm:w-7" strokeWidth={1.4} aria-hidden />
                    </div>
                )}
            </div>

            <div className="flex min-w-0 flex-1 flex-col gap-1.5 px-3 py-3 sm:gap-2 sm:px-4 sm:py-3.5" dir="rtl">
                <div className="flex items-center justify-end ">
                    <span className="text-sm font-bold text-gray-900 dark:text-gray-50 sm:text-[15px]">
                        #{order.id}
                    </span>
                    <Heart
                        aria-hidden
                        className="h-4 w-4 shrink-0 fill-[#30913F] text-[#30913F]"
                        strokeWidth={0}
                    />

                </div>

                <p className="truncate text-sm font-semibold text-gray-800 dark:text-gray-100 sm:text-[15px]">
                    {storeName}
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
                    <Clock className="h-3 w-3 shrink-0 text-gray-400 dark:text-gray-500 sm:h-3.5 sm:w-3.5" strokeWidth={1.6} aria-hidden />
                    <p className="truncate text-xs text-gray-500 dark:text-gray-400 sm:text-[13px]">
                        تاريخ الطلب {order.order_time}
                    </p>
                </div>

                <p className="text-sm font-bold text-gray-900 dark:text-gray-50 sm:text-[15px]">
                    إجمالي التكلفة {order.order_amount?.toFixed(2) ?? 0} ﷼
                </p>
            </div>

            <div className="flex w-9 shrink-0 items-center justify-center self-stretch sm:w-10 md:w-11">
                <ChevronLeft className="h-4 w-4 text-gray-400 dark:text-gray-500 sm:h-[18px] sm:w-[18px]" strokeWidth={2} aria-hidden />
            </div>
        </article>
    );
}

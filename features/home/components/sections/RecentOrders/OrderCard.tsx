import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { RecentOrder } from "@/features/home/types/recent-orders.types";

function timeAgo(dateStr: string): string {
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) return dateStr;

    const diffMs = Date.now() - date.getTime();
    const diffMins = Math.floor(diffMs / 60_000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffMonths = Math.floor(diffDays / 30);

    if (diffMins < 1) return "منذ لحظات";
    if (diffMins < 60) return `منذ ${diffMins} ${diffMins === 1 ? "دقيقة" : "دقائق"}`;
    if (diffHours < 24) return `منذ ${diffHours} ${diffHours === 1 ? "ساعة" : "ساعات"}`;
    if (diffDays < 30) return `منذ ${diffDays} ${diffDays === 1 ? "يوم" : "أيام"}`;
    return `منذ ${diffMonths} ${diffMonths === 1 ? "شهر" : "أشهر"}`;
}

export function OrderCard({ order }: { order: RecentOrder }) {
    return (
        <Link
            href={`/my-orders?reorder=${order.id}`}
            className={[
                "flex w-full items-center gap-3 rounded-2xl bg-white px-4 py-3",
                "shadow-sm ring-1 ring-black/[0.05] outline-none",
                "transition-transform duration-150 active:scale-[0.99]",
                "focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2",
            ].join(" ")}
            aria-label={`أعد طلبك من ${order.store_name}`}
            dir="rtl"
        >
            <div className="relative h-[52px] w-[52px] shrink-0 overflow-hidden rounded-xl bg-gray-100">
                <Image src={order.store_logo} alt={order.store_name} fill className="object-cover" sizes="52px" loading="lazy" />
            </div>
            <div className="min-w-0 flex-1 space-y-1.5">
                <h3 className="line-clamp-1 text-[15px] font-bold text-gray-900">{order.store_name}</h3>
                <div className="flex flex-wrap items-center gap-1.5">
                    {order.module_name && (
                        <span className="rounded-full bg-[#E0F7FA] px-2.5 py-0.5 text-xs font-medium text-[#00796B]">
                            {order.module_name}
                        </span>
                    )}
                    {order.module_name && <span className="text-gray-300" aria-hidden>•</span>}
                    <span className="text-xs text-gray-400">{timeAgo(order.order_date)}</span>
                </div>
            </div>
            <ChevronLeft className="h-4 w-4 shrink-0 text-gray-300" />
        </Link>
    );
}

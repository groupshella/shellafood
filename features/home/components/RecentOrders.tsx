"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { useRecentOrders } from "@/features/home/hooks/useRecentOrders";
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

// ── Card ──────────────────────────────────────────────────────────────────────

function OrderCard({ order }: { order: RecentOrder }) {
    const [logoError, setLogoError] = useState(false);

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
            {/* Logo */}
            <div className="relative h-[52px] w-[52px] shrink-0 overflow-hidden rounded-xl bg-gray-100">
                {!logoError && order.store_logo ? (
                    <Image
                        src={order.store_logo}
                        alt={order.store_name}
                        fill
                        className="object-cover"
                        sizes="52px"
                        onError={() => setLogoError(true)}
                    />
                ) : (
                    <div className="h-full w-full bg-gradient-to-br from-[#30913F]/20 to-[#30913F]/40" />
                )}
            </div>

            {/* Text */}
            <div className="min-w-0 flex-1 space-y-1.5">
                <h3 className="line-clamp-1 text-[15px] font-bold text-gray-900">
                    {order.store_name}
                </h3>
                <div className="flex flex-wrap items-center gap-1.5">
                    {order.module_name ? (
                        <span className="rounded-full bg-[#E0F7FA] px-2.5 py-0.5 text-xs font-medium text-[#00796B]">
                            {order.module_name}
                        </span>
                    ) : null}
                    {order.module_name ? (
                        <span className="text-gray-300" aria-hidden>
                            •
                        </span>
                    ) : null}
                    <span className="text-xs text-gray-400">{timeAgo(order.order_date)}</span>
                </div>
            </div>

            {/* Chevron */}
            <ChevronLeft className="h-4 w-4 shrink-0 text-gray-300" />
        </Link>
    );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function RecentOrdersSkeleton() {
    return (
        <div className="space-y-3">
            <div className="h-7 w-32 animate-pulse rounded-lg bg-gray-100" />
            <div className="space-y-2.5">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-black/[0.05]">
                        <div className="h-[52px] w-[52px] shrink-0 animate-pulse rounded-xl bg-gray-100" />
                        <div className="flex-1 space-y-2">
                            <div className="h-3.5 w-2/3 animate-pulse rounded bg-gray-100" />
                            <div className="flex items-center gap-1.5">
                                <div className="h-5 w-16 animate-pulse rounded-full bg-gray-100" />
                                <div className="h-3 w-20 animate-pulse rounded bg-gray-100" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ── Section ───────────────────────────────────────────────────────────────────

export default function RecentOrders() {
    const { orders, isLoading, error } = useRecentOrders();

    if (isLoading) return <RecentOrdersSkeleton />;
    if (error || orders.length === 0) return null;

    return (
        <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.2 }}
            aria-label="أعد طلبك"
            className="mx-auto w-full max-w-5xl space-y-3 px-4"
        >
            <h2 className="text-lg font-bold text-gray-800">أعد طلبك</h2>

            <div className="space-y-2.5">
                {orders.map((order) => (
                    <OrderCard key={order.id} order={order} />
                ))}
            </div>
        </motion.section>
    );
}

"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRecentOrders } from "@/features/module/hooks/useRecentOrders";
import { RecentOrder } from "@/features/module/types/recent-orders.types";

// ── Card ──────────────────────────────────────────────────────────────────────

function OrderCard({ order }: { order: RecentOrder }) {
    const [logoError, setLogoError] = useState(false);

    return (
        <Link
            href={`/my-orders?reorder=${order.id}`}
            className={[
                "flex w-[88px] shrink-0 flex-col items-center gap-2 rounded-xl outline-none",
                "transition-transform duration-150 active:scale-[0.96]",
                "focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2",
            ].join(" ")}
            aria-label={`أعد طلبك من ${order.store_name}`}
            dir="rtl"
        >
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/[0.06]">
                {!logoError && order.store_logo ? (
                    <Image
                        src={order.store_logo}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="64px"
                        onError={() => setLogoError(true)}
                    />
                ) : (
                    <div className="h-full w-full bg-gradient-to-br from-[#30913F]/20 to-[#30913F]/40" />
                )}
            </div>

            <h3 className="line-clamp-2 w-full text-center text-xs font-bold leading-tight text-gray-900">
                {order.store_name}
            </h3>
        </Link>
    );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function RecentOrdersSkeleton() {
    return (
        <div className="space-y-3">
            <div className="h-7 w-32 animate-pulse rounded-lg bg-gray-100" />
            <div className="flex gap-4 overflow-hidden">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex w-[88px] shrink-0 flex-col items-center gap-2">
                        <div className="h-16 w-16 animate-pulse rounded-2xl bg-gray-100" />
                        <div className="h-3 w-full animate-pulse rounded bg-gray-100" />
                        <div className="h-3 w-3/4 animate-pulse rounded bg-gray-100" />
                    </div>
                ))}
            </div>
        </div>
    );
}

// ── Section ───────────────────────────────────────────────────────────────────

export default function RecentOrders({ moduleId, moduleName }: { moduleId: string; moduleName: string }) {
    const { orders, isLoading, error } = useRecentOrders(moduleId);

    if (isLoading) return <RecentOrdersSkeleton />;
    if (error || orders.length === 0) return null;

    return (
        <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.2 }}
            aria-label="الطلبات السابقة"
            className="mx-auto w-full max-w-5xl space-y-3 px-4"
        >
            <h2 className="text-lg font-bold text-gray-800">
                الطلبات السابقة
            </h2>

            <div
                className={[
                    "flex gap-4 overflow-x-auto pb-1",
                    "snap-x snap-mandatory scroll-smooth",
                    "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
                ].join(" ")}
            >
                {orders.map((order) => (
                    <div key={order.id} className="snap-start">
                        <OrderCard order={order} />
                    </div>
                ))}
            </div>
        </motion.section>
    );
}

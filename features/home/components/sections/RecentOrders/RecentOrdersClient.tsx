"use client";

import { RecentOrder } from "@/features/home/types/recent-orders.types";
import { OrderCard } from "./OrderCard";

export function RecentOrdersClient({ orders }: { orders: RecentOrder[] }) {
    return (
        <section aria-label="أعد طلبك" className="mx-auto w-full max-w-5xl space-y-3 px-4">
            <h2 className="text-lg font-bold text-gray-800">أعد طلبك</h2>
            <div className="space-y-2.5">
                {orders.map((order) => (
                    <OrderCard key={order.id} order={order} />
                ))}
            </div>
        </section>
    );
}

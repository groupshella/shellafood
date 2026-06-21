"use client";

import { RecentOrder } from "@/features/markets/types/recent-orders.types";
import { ScrollContainer } from "@/features/home/components/shared/ScrollContainer";
import { OrderCard } from "./OrderCard";

export function RecentOrdersClient({ orders }: { orders: RecentOrder[] }) {
    return (
        <section aria-label="الطلبات السابقة" className="mx-auto w-full max-w-5xl space-y-3 px-4">
            <h2 className="text-lg font-bold text-gray-800">الطلبات السابقة</h2>
            <ScrollContainer className="gap-4">
                {orders.map((order) => (
                    <div key={order.id} className="snap-start">
                        <OrderCard order={order} />
                    </div>
                ))}
            </ScrollContainer>
        </section>
    );
}

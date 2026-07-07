"use client";

import { RecentOrder } from "@/features/markets/types/recent-orders.types";
import { ScrollContainer } from "@/features/home/components/shared/ScrollContainer";
import { OrderCard } from "./OrderCard";

export function RecentOrdersClient({ orders }: { orders: RecentOrder[] }) {
    return (
        <section
            aria-label="الطلبات السابقة"
            className="mx-auto w-full max-w-lg space-y-3 px-3 sm:max-w-2xl sm:px-5 lg:max-w-4xl lg:px-6 xl:max-w-5xl 2xl:max-w-6xl"
        >
            <h2 className="text-base font-bold text-gray-800 dark:text-gray-100 sm:text-lg">الطلبات السابقة</h2>
            <ScrollContainer className="gap-3 sm:gap-4">
                {orders.map((order) => (
                    <div key={order.id} className="snap-start">
                        <OrderCard order={order} />
                    </div>
                ))}
            </ScrollContainer>
        </section>
    );
}

"use client";

import { groupByDate } from "@/features/favorites/components/shared/dateGroups";
import { EmptyFavorites } from "@/features/favorites/components/shared/EmptyFavorites";
import { OrderCard } from "./OrderCard";
import type { ApiOrder } from "@/features/favorites/types/favorites.types";

interface OrdersTabClientProps {
    orders: ApiOrder[];
}

export function OrdersTabClient({ orders }: OrdersTabClientProps) {
    if (orders.length === 0) {
        return <EmptyFavorites />;
    }

    const groups = groupByDate(orders);

    return (
        <div className="space-y-6 px-4 py-4">
            {groups.map((group) => (
                <section key={group.key}>
                    <p className="mb-2 text-right text-[13px] font-semibold text-[#707784]">
                        {group.label}
                    </p>
                    <div className="space-y-3">
                        {group.items.map((order) => (
                            <OrderCard key={order.id} order={order} />
                        ))}
                    </div>
                </section>
            ))}
        </div>
    );
}

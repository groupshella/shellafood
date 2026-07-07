"use client";

import { groupByDate } from "@/features/favorites/components/shared/dateGroups";
import { EmptyFavorites } from "@/features/favorites/components/shared/EmptyFavorites";
import { OrderCard } from "./OrderCard";
import type { ApiOrder } from "@/features/favorites/types/favorites.types";

const CONTENT_PADDING = "px-3 py-4 sm:px-4 sm:py-5 md:px-5 lg:px-6";
const ITEMS_GRID = "grid grid-cols-1 gap-2.5 md:grid-cols-2 md:gap-3 lg:gap-4";
const SECTION_HEADING =
    "mb-2.5 text-right text-sm font-semibold text-gray-500 dark:text-gray-400 sm:mb-3 sm:text-[15px]";

interface OrdersTabClientProps {
    orders: ApiOrder[];
}

export function OrdersTabClient({ orders }: OrdersTabClientProps) {
    if (orders.length === 0) {
        return <EmptyFavorites />;
    }

    const groups = groupByDate(orders);

    return (
        <div className={`space-y-5 sm:space-y-6 ${CONTENT_PADDING}`}>
            {groups.map((group) => (
                <section key={group.key}>
                    <p className={SECTION_HEADING}>{group.label}</p>
                    <div className={ITEMS_GRID}>
                        {group.items.map((order) => (
                            <OrderCard key={order.id} order={order} />
                        ))}
                    </div>
                </section>
            ))}
        </div>
    );
}
